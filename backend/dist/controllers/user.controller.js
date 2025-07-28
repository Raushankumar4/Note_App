"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.resendOtp = exports.loginUser = exports.verifyOtp = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const generateOtp_1 = require("../utils/generateOtp");
const sendMail_1 = require("../mail/sendMail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Valid email is required" });
        }
        const otp = (0, generateOtp_1.generateOTP)();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        let user = await user_model_1.User.findOne({ email });
        if (user?.authMethod === "google") {
            return res.status(403).json({
                message: "This email is registered via Google. Please login with Google.",
            });
        }
        if (!user) {
            user = new user_model_1.User({
                email,
                otp,
                otpExpiresAt,
                authMethod: "email",
                username,
            });
        }
        else {
            user.otp = otp;
            user.otpExpiresAt = otpExpiresAt;
        }
        await user.save();
        await (0, sendMail_1.sendEmail)(email, otp);
        return res
            .status(200)
            .json({ message: "OTP has been sent to your email." });
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.registerUser = registerUser;
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No Email Exist Please Signup" });
        }
        if (!user ||
            user.otp !== otp ||
            new Date(user.otpExpiresAt) < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.isVerified = true;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user?._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({ message: "Otp Verified", token });
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyOtp = verifyOtp;
const loginUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Valid email is required" });
        }
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Exist" });
        }
        if (user?.authMethod === "google") {
            return res.status(403).json({
                message: "This email is registered via Google. Please login with Google.",
            });
        }
        if (user?.isVerified === false) {
            return res.status(401).json({ message: "Please Verify Email" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user?._id, email: user?.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.status(200).json({ message: "Login SuccessFully.", token });
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = (0, generateOtp_1.generateOTP)();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mints
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
        await (0, sendMail_1.sendEmail)(user.email, otp);
        res.status(200).json({ message: "OTP resent successfully" });
    }
    catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.resendOtp = resendOtp;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            name: user.username,
            email: user.email,
            avatar: user.avatar,
            userId,
        });
    }
    catch (error) {
        console.error("Error while getting profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = getProfile;
