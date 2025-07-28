import { Router } from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middlware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").put(resendOtp);
router.route("/profile").get(authenticate, getProfile);

export default router;
