import express, { Router } from "express";
import {
  loginUser,
  userRegistration,
  verifyUser,
  verifyForgotPasswordOtp,
  verifyUserForgotPassword,
} from "../controller/auth.conmtroller";
import { resetUserPassword } from "../utils/auth.helper";

const router: Router = express.Router();
router.post("/user-registration", userRegistration);

router.post("/verify-user", verifyUser);

router.post("/login-user", loginUser);

router.post("/forgot-password-user", verifyUserForgotPassword);

router.post("/reset-password-user", resetUserPassword);

router.post("/verify-forgot-password-user", verifyForgotPasswordOtp);
export default router;
