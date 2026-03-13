import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
});

export const User = mongoose.model("users", userSchema);
