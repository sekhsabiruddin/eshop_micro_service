import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../../packages/errors";
import crypto from "crypto";
import { sendEmail } from "../utils/sendMail";
import redis from "../../../../packages/libs/redis";
import { prisma } from "@packages/libs/prisma";
import bcrypt from "bcryptjs";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Validate registration inputs
export const validateRegistrationData = (
  data: {
    name?: string;
    email?: string;
    password?: string;
    phone_number?: string;
    country?: string;
  },
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (!name || !email || !password) {
    throw new ValidationError(
      "Missing required fields: name, email or password."
    );
  }

  if (userType === "seller" && (!phone_number || !country)) {
    throw new ValidationError("Sellers must provide phone number and country.");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format.");
  }

  return true;
};

// ✅ Check OTP spam/cooldown/lock restrictions
export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
): Promise<void> => {
  const otpLockKey = `otp_lock:${email}`;
  const otpSpamKey = `otp_spam:${email}`;
  const otpCooldownKey = `otp_cooldown:${email}`;

  if (await redis.get(otpLockKey)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes."
      )
    );
  }

  if (await redis.get(otpSpamKey)) {
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait and try again later."
      )
    );
  }

  if (await redis.get(otpCooldownKey)) {
    return next(
      new ValidationError("Please wait 1 minute before requesting a new OTP!")
    );
  }
};

// ✅ Send OTP
export const sendOtp = async (
  name: string,
  email: string,
  template: string
): Promise<void> => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300); // 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // 1 minute cooldown
};

// ✅ Track OTP request attempts
export const trackOtpRequests = async (
  email: string,
  next: NextFunction
): Promise<void> => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpSpamLockKey = `otp_spam:${email}`;

  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(otpSpamLockKey, "locked", "EX", 3600); // 1 hour
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait 1 hour before requesting again."
      )
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // Track for 1 hour
};

// ✅ Verify OTP
export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
): Promise<boolean> => {
  const isLocked = await redis.get(`otp_lock:${email}`);
  if (isLocked) {
    next(
      new ValidationError(
        "Your account is temporarily locked due to multiple failed OTP attempts."
      )
    );
    return false;
  }

  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    next(new ValidationError("Invalid or expired OTP!"));
    return false;
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (otp !== storedOtp) {
    const newAttempts = failedAttempts + 1;

    if (newAttempts >= 3) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // 30 mins
      await redis.del(`otp:${email}`);
      await redis.del(failedAttemptsKey);
      next(
        new ValidationError(
          "Too many failed attempts. Your account is locked for 30 minutes."
        )
      );
      return false;
    }

    await redis.set(failedAttemptsKey, newAttempts.toString(), "EX", 300);
    next(
      new ValidationError(`Incorrect OTP. ${3 - newAttempts} attempts left.`)
    );
    return false;
  }

  // OTP is valid
  await redis.del(`otp:${email}`);
  await redis.del(failedAttemptsKey);
  return true;
};

// ✅ Handle Forgot Password (with OTP)

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return next(new ValidationError("Email and new password are required!"));
    }

    // Find user by email
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new ValidationError("User not found!"));
    }

    if (!user.password) {
      return next(new ValidationError("User has no password set."));
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return next(
        new ValidationError("New password cannot be the same as the old one.")
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Send success response
    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;

    if (!email) throw new ValidationError("Email is required!");

    // Find user/seller in DB
    const user =
      userType === "user"
        ? await prisma.users.findUnique({ where: { email } })
        : await prisma.sellers.findUnique({ where: { email } });

    if (!user) throw new ValidationError(`${userType} not found!`);

    // Check otp restrictions
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);

    // Generate OTP and send Email
    await sendOtp(
      user.name,
      email,
      userType === "user"
        ? "forgot-password-user-mail"
        : "forgot-password-seller-mail"
    );

    res
      .status(200)
      .json({ message: "OTP sent to email. Please verify your account." });
  } catch (error) {
    next(error);
  }
};

export const verifyForgetPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return next(new ValidationError("All fields are required!"));
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return next(new ValidationError("Invalid email format."));
    }

    // Check OTP restrictions
    await checkOtpRestrictions(email, next);

    // Verify OTP
    const otpVerified = await verifyOtp(email, otp, next);
    if (!otpVerified) {
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in DB
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
};
