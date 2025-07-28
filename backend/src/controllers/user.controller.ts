import { AuthenticatedRequest } from "./../middleware/auth.middlware";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateOTP } from "../utils/generateOtp";
import { sendEmail } from "../mail/sendMail";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ email });

    if (user?.authMethod === "google") {
      return res.status(403).json({
        message:
          "This email is registered via Google. Please login with Google.",
      });
    }

    if (!user) {
      user = new User({
        email,
        otp,
        otpExpiresAt,
        authMethod: "email",
        username,
      });
    } else {
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
    }

    await user.save();

    await sendEmail(email, otp);

    return res
      .status(200)
      .json({ message: "OTP has been sent to your email." });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No Email Exist Please Signup" });
    }
    if (
      !user ||
      user.otp !== otp ||
      new Date(user.otpExpiresAt!) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { id: user?._id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ message: "Otp Verified", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Valid email is required" });
    }
    let user = await User.findOne({ email });

    if (user?.authMethod === "google") {
      return res.status(403).json({
        message:
          "This email is registered via Google. Please login with Google.",
      });
    }
    if (user?.isVerified === false) {
      return res.status(401).json({ message: "Please Verify Email" });
    }
    const token = jwt.sign(
      { id: user?._id, email: user?.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).json({ message: "Login SuccessFully.", token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();

    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mints

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendEmail(user.email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.username,
      email: user.email,
      avatar: user.avatar,
      userId,
    });
  } catch (error) {
    console.error("Error while getting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
