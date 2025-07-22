import { NextFunction, Response } from "express";
import { AuthError } from "../errors";

export const isSeller = (req: any, res: Response, next: NextFunction) => {
  console.log("req.role", req.role);
  if (req.role !== "seller") {
    return next(new AuthError("Access denied: Seller only"));
  }
  next();
};

export const isUser = (req: any, res: Response, next: NextFunction) => {
  if (req.role !== "user") {
    return next(new AuthError("Access denied: User only"));
  }
  next();
};
