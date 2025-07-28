import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  username?: string;
  otp?: string;
  otpExpiresAt?: Date;
  authMethod: "email" | "google";
  googleId?: string;
  avatar?: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    authMethod: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    googleId: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
