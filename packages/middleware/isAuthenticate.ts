import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@packages/libs/prisma"; // Adjust the import based on your setup

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies["seller-access-token"] || // ✅ Correct for sellers
      req.cookies["access_token"] || // ✅ Fallback for users
      req.headers.authorization?.split(" ")[1];

    console.log("token", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! Token missing." });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Unauthorized! Invalid token.",
      });
    }

    let account;

    if (decoded.role === "user") {
      account = await prisma.users.findUnique({
        where: { id: decoded.id },
      });
      req.user = account;
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: { shop: true }, // Optional: include related shop info
      });
      req.seller = account;
    }

    if (!account) {
      return res.status(401).json({ message: "Account not found!" });
    }

    req.role = decoded.role;

    return next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      message: "Unauthorized! Token expired or invalid.",
    });
  }
};

export default isAuthenticated;
