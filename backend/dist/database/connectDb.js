"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in .env");
        }
        const instance = await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB Connected: ${instance.connection.host}`);
    }
    catch (error) {
        console.error(`Error While Connecting to DB: ${error}`);
        process.exit(1);
    }
};
exports.connectToDB = connectToDB;
