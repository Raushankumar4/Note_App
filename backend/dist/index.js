"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./googleAuth/passport");
const connectDb_1 = require("./database/connectDb");
const errorHandler_1 = require("./middleware/errorHandler");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const google_routes_1 = __importDefault(require("./routes/google.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2000;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "https://note-app-eta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});
app.use("/api/v1/auth", google_routes_1.default);
app.use("/api/v1/user", user_routes_1.default);
app.use("/api/v1/note", note_routes_1.default);
app.get("/", (req, res) => {
    res.send(`Server is Running on :: ${PORT}`);
});
app.use(errorHandler_1.ErrorHandler);
(0, connectDb_1.connectToDB)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is Running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
});
