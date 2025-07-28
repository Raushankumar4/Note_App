import nodemailer from "nodemailer";
import { otpVerification } from "./emailTemplate";

export const sendEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Note App",
    html: otpVerification(email, otp),
  });
};
