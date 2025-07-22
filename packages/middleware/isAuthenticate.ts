// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { prisma } from "../libs/prisma";

// const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     const token =
//       req.cookies["seller-access-token"] ||
//       req.cookies["access_token"] ||
//       req.headers.authorization?.split(" ")[1];

//     console.log("token", token);
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized! Token missing." });
//     }

//     // Decode token
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
//       id: string;
//       role: "user" | "seller";
//     };

//     if (!decoded || !decoded.id || !decoded.role) {
//       return res.status(401).json({
//         message: "Unauthorized! Invalid token.",
//       });
//     }

//     let account;

//     if (decoded.role === "user") {
//       account = await prisma.users.findUnique({
//         where: { id: decoded.id },
//       });
//       req.user = account;
//     } else if (decoded.role === "seller") {
//       account = await prisma.sellers.findUnique({
//         where: { id: decoded.id },
//         include: { shop: true }, // Optional: include related shop info
//       });
//       req.seller = account;
//     }

//     if (!account) {
//       return res.status(401).json({ message: "Account not found!" });
//     }

//     req.role = decoded.role;

//     return next();
//   } catch (error: any) {
//     console.error("Authentication error:", error.message);
//     return res.status(401).json({
//       message: "Unauthorized! Token expired or invalid.",
//     });
//   }
// };

// export default isAuthenticated;
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";

const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies["access_token"] ||
      // req.cookies["seller-access-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized! Token missing." });
      return;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId?: string;
      id?: string;
      role: "user" | "seller";
    };

    const accountId = decoded.id || decoded.userId;

    if (!decoded || !accountId || !decoded.role) {
      res.status(401).json({ message: "Unauthorized! Invalid token." });
      return;
    }

    let account;

    if (decoded.role === "user") {
      account = await prisma.users.findUnique({ where: { id: accountId } });
      req.user = account;
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: accountId },
        include: { shop: true },
      });
      req.seller = account;
    }

    if (!account) {
      res.status(401).json({ message: "Account not found!" });
      return;
    }

    req.role = decoded.role;
    next();
    return; // ✅ Explicit return after next()
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      message: "Unauthorized! Token expired or invalid.",
    });
    return;
  }
};
export default isAuthenticated;
