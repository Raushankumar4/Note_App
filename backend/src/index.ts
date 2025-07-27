import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { connectToDB } from "./database/connectDb";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PSOT", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 2000;

app.get("/", (req: Request, res: Response) => {
  res.send(`Server is Running on::${PORT}`);
});

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`);
  });
});
