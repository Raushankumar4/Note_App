import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(4, "OTP must be at least 4 digits").optional(),
});
