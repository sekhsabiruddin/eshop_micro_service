import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@packages/libs/prisma"; // Adjust the import based on your setup

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies["access_token"] ||
      req.cookies["seller-access-token"] ||
      req.headers.authorization?.split(" ")[1];

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
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized! Token expired or invalid.",
    });
  }
};

export default isAuthenticated;
