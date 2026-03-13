import mongoose from "mongoose";
import "dotenv/config";

export const connectDb = async() => {
  try {
    await mongoose.connect(process.env.DB_URL!);
    console.log("Database is connected!");
  } catch (error: any) {
    console.log("DB connection error", error.message);
  }
}