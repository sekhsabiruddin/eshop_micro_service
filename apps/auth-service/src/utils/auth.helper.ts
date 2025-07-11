import { ValidationError } from "../../../../packages/errors";

import crypto from "crypto";
import { sendEmail } from "../utils/sendMail";
import redis from "../../../../packages/libs/redis";
import { NextFunction } from "express";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export const sendOtp = async (
  name: string,
  email: string,
  template: string
): Promise<void> => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
export const trackOtpRequests = async (
  email: string,
  next: NextFunction
): Promise<void> => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpSpamLockKey = `otp_spam:${email}`;

  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(otpSpamLockKey, "locked", "EX", 3600); // 1 hour lock
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait 1 hour before requesting again."
      )
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};
