import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/api/v1/user/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        if (user && user.authMethod === "email") {
          return done(null, false, {
            message:
              "Email already registered using OTP. Please login via OTP.",
          });
        }

        if (!user) {
          user = new User({
            email,
            username: profile.displayName,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            authMethod: "google",
          });
          await user.save();
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });

        return done(null, { token });
      } catch (error) {
        console.error("Google strategy error:", error);
        return done(error, false);
      }
    }
  )
);
