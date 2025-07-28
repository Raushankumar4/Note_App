import { Router } from "express";
import {
  getProfile,
  registerUser,
  verifyOtp,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middlware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(verifyOtp);
router.route("/profile").get(authenticate, getProfile);

export default router;
