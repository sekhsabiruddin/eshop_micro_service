import express, { Router } from "express";
import {
  loginUser,
  userRegistration,
  verifyUser,
  verifyForgotPasswordOtp,
  verifyUserForgotPassword,
  refreshToken,
  getUser,
  registerSeller,
  verifySeller,
  createShop,
  loginSeller,
  getSeller,
} from "../controller/auth.conmtroller";
import { resetUserPassword } from "../utils/auth.helper";
import isAuthenticated from "@packages/middleware/isAuthenticate";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
// router.post("/forgot-password-user", userForgotPassword);
router.post("/reset-password-user", resetUserPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);
router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/login-seller", loginSeller);
router.get("/logged-in-seller", isAuthenticated, isSeller, getSeller);

export default router;
