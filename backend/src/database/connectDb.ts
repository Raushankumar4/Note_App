import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env");
    }
    const instance = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${instance.connection.host}`);
  } catch (error) {
    console.error(`Error While Connecting to DB: ${error}`);
    process.exit(1);
  }
};
