import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./googleAuth/passport";

import { connectToDB } from "./database/connectDb";
import { ErrorHandler } from "./middleware/errorHandler";
import userAuthRoutes from "./routes/user.routes";
import noteRoutes from "./routes/note.routes";
import authRoutes from "./routes/google.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://note-app-eta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/favicon.ico", (req: Request, res: Response) => {
  res.status(204).end();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userAuthRoutes);
app.use("/api/v1/note", noteRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(`Server is Running on :: ${PORT}`);
});

app.use(ErrorHandler);

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is Running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
