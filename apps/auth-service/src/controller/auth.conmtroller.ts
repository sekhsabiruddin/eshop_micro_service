import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
  verifyForgetPasswordOtp,
  verifyOtp,
} from "../utils/auth.helper";
import { prisma } from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/errors";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("User registration data:", req.body);
    validateRegistrationData(req.body, "user");

    const { name, email, password } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "userRegistration");

    // TODO: Create the user, send OTP, or continue flow
    res
      .status(200)
      .json({ message: "OTP sent to email. please verify your account" });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      email,
      otp,
      password,
      name,
    }: { email: string; otp: string; password: string; name: string } =
      req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required!"));
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    const otpVerified: boolean = await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
    if (!otpVerified) {
      return next(new ValidationError("Invalid or expired OTP!"));
    }

    res.status(201).json({ message: "User verified successfully!" });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required!"));
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new AuthError("Invalid email or password."));
    }
    //  Use Non-null Assertion (!)
    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return next(new AuthError("Invalid email or password."));
    }
    res.clearCookie("seller_access_token");
    res.clearCookie("seller_refresh_token");

    // Generate JWT token and refresh token
    const accessToken = jwt.sign(
      { userId: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );
    // Store refresh token in the database in an https-only cookie
    setCookie(res, "refresh_token", refreshToken);
    setCookie(res, "access_token", accessToken);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError("Email is required!");
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return next(new ValidationError("User not found!"));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);

    await sendOtp(user.name, email, "forgotPassword");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgetPasswordOtp(req, res, next);
};

// export const refreshToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // 1. Get refresh token from cookie
//     const refreshToken =
//       req.cookies["refresh_token"] ||
//       req.cookies["seller-refresh-token"] ||
//       req.headers.authorization?.split(" ")[1];

//     if (!refreshToken) {
//       return new ValidationError("Unauthorized! No refresh token.");
//     }

//     // 2. Decode the token
//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET as string
//     ) as { id: string; role: string };

//     // 3. Validate decoded token
//     if (!decoded || !decoded.id || !decoded.role) {
//       return next(new JsonWebTokenError("Forbidden! Invalid refresh token."));
//     }

//     // 4. Find user/seller based on role
//     let account;
//     if (decoded.role === "user") {
//       account = await prisma.users.findUnique({
//         where: { id: decoded.id },
//       });
//     } else if (decoded.role === "seller") {
//       account = await prisma.sellers.findUnique({
//         where: { id: decoded.id },
//         include: { shop: true },
//       });
//     }

//     // 5. If no account found
//     if (!account) {
//       return next(new AuthError("Forbidden! User/Seller not found"));
//     }

//     // 6. Generate new access token
//     const newAccessToken = jwt.sign(
//       { id: decoded.id, role: decoded.role },
//       process.env.ACCESS_TOKEN_SECRET as string,
//       { expiresIn: "15m" }
//     );

//     // 7. Set the new token cookie
//     res.cookie("access_token", newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     if (decoded.role === "user") {
//       setCookie(res, "access_token", newAccessToken);
//     } else if (decoded.role === "seller") {
//       setCookie(res, "seller_access_token", newAccessToken);
//     }

//     // 8. Return success
//     return res.status(201).json({ success: true });
//   } catch (error) {
//     return next(error);
//   }
// };
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get refresh token from cookie or header
    const refreshToken =
      req.cookies["refresh_token"] ||
      req.cookies["seller-refresh-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return next(new ValidationError("Unauthorized! No refresh token."));
    }

    // 2. Decode the token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: "user" | "seller" };

    if (!decoded || !decoded.id || !decoded.role) {
      return next(new JsonWebTokenError("Forbidden! Invalid refresh token."));
    }

    // 3. Find user or seller
    let account;
    if (decoded.role === "user") {
      account = await prisma.users.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: { shop: true },
      });
    }

    if (!account) {
      return next(new AuthError("Forbidden! Account not found."));
    }

    // 4. Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    // 5. Set cookie based on role (only once!)
    const cookieName =
      decoded.role === "user" ? "access_token" : "seller-access-token";

    setCookie(res, cookieName, newAccessToken);

    // 6. Send success response
    return res.status(201).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");

    const { name, email } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      throw new ValidationError("Seller already exists with this email!");
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "seller-activation");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;

    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("All fields are required!"));
    }

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      return next(
        new ValidationError("Seller already exists with this email!")
      );
    }

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phone_number,
      },
    });

    res
      .status(201)
      .json({ seller, message: "Seller registered successfully!" });
  } catch (error) {
    next(error);
  }
};
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;

    if (!name || !address || !opening_hours || !category || !sellerId) {
      return next(new Error("All required fields must be filled."));
    }

    // Step 1: Create the shop
    const shop = await prisma.shops.create({
      data: {
        name,
        bio,
        address,
        opening_hours,
        category,
        website: website?.trim() || undefined,
      },
    });

    // Step 2: Connect seller to shop
    await prisma.sellers.update({
      where: { id: sellerId },
      data: {
        shopId: shop.id,
      },
    });

    res.status(201).json({
      message: "Shop created and seller linked!",
      shop,
    });
  } catch (error) {
    console.error("❌ Shop creation failed:", error);
    next(error);
  }
};

export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required!"));
    }

    const seller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (!seller) {
      return next(new ValidationError("Invalid email or password!"));
    }

    const isMatch = await bcrypt.compare(password, seller.password!);
    if (!isMatch) {
      return next(new ValidationError("Invalid email or password!"));
    }
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    // Generate tokens
    const accessToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Store tokens in cookies
    setCookie(res, "seller-refresh-token", refreshToken);
    setCookie(res, "seller-access-token", accessToken);

    // Response
    res.status(200).json({
      message: "Login successful!",
      seller: {
        id: seller.id,
        email: seller.email,
        name: seller.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSeller = async (
  req: any, // Ideally, use a custom type with seller attached
  res: Response,
  next: NextFunction
) => {
  try {
    const seller = req.seller;

    res.status(201).json({
      success: true,
      seller,
    });
  } catch (error) {
    next(error);
  }
};
