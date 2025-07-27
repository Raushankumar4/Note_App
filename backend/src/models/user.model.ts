import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  username?: string;
  otp?: string;
  otpExpiresAt?: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiresAt: { type: Date },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
