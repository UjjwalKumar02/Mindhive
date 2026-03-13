import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import { connectDb } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

(async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`HTTP server is running on ${PORT}!`);
  });
})();
