import { Request, Response } from "express";
import { User } from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }
    const newUser = await User.create({ username, email });

    return res.status(201).json({
      message: "User registered successfully",
      user: { newUser },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


