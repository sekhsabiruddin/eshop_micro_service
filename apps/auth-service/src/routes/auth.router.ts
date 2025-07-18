import express, { Router } from "express";
import {
  loginUser,
  userRegistration,
  verifyUser,
  // verifyForgotPasswordOtp,
  verifyUserForgotPassword,
  refreshToken,
  getUser,
  registerSeller,
  verifySeller,
  createShop,
  loginSeller,
  getSeller,
} from "../controller/auth.conmtroller";
// import { resetUserPassword } from "../utils/auth.helper";
import isAuthenticated from "@packages/middleware/isAuthenticate";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();

// Public user routes
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token", isAuthenticated, refreshToken);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);
router.post("/reset-password-user", verifyUserForgotPassword); // ✅ Assuming this is OTP-based
router.post("/create-shop", createShop);
// Protected user route

// Public seller routes
router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/login-seller", loginSeller);

// Protected seller routes

// router.get("/logged-in-user", isAuthenticated, getUser);
router.get("/logged-in-seller", isAuthenticated, isSeller, getSeller);

export default router;
