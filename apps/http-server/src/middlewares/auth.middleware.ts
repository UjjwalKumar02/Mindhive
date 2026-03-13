import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ error: "Token is empty" });
    return;
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET!);

    // Decoded token validation
    if (typeof decoded === "string" || !decoded.id) {
      res.status(401).json({ error: "Invalid token!" });
      return;
    }

    // @ts-ignore
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token!" });
    return;
  }
};
