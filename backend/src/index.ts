import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import { connectToDB } from "./database/connectDb";
import { ErrorHandler } from "./middleware/errorHandler";
import userAuthRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

// CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userAuthRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send(`Server is Running on :: ${PORT}`);
});

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(ErrorHandler);

// DB and server start
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
