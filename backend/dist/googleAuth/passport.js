"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email)
            return done(null, false);
        let user = await user_model_1.User.findOne({ email });
        if (user && user.authMethod === "email") {
            return done(null, false, {
                message: "Email already registered using OTP. Please login via OTP.",
            });
        }
        if (!user) {
            user = new user_model_1.User({
                email,
                username: profile.displayName,
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value || "",
                authMethod: "google",
            });
            await user.save();
        }
        const token = jsonwebtoken_1.default.sign({ id: user?._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return done(null, { token });
    }
    catch (error) {
        console.error("Google strategy error:", error);
        return done(error, false);
    }
}));
