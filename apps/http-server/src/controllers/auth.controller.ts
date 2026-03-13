import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { LoginReqBody, SignupReqBody } from "../types/auth.types.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// Signup
export const onSignup = async (req: Request, res: Response) => {
  // DTO
  const result = SignupReqBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { name, email, password, avatar } = result.data;

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 7);

  try {
    // Existing user
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    res.status(200).json({ message: "Signup successful!" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Login
export const onLogin = async (req: Request, res: Response) => {
  // DTO
  const result = LoginReqBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { email, password } = result.data;

  try {
    // Find user
    const user = await User.findOne({
      email,
    });
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    // Password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Wrong password!" });
      return;
    }

    // Token generation
    const ACCESS_TOKEN_LIMIT = 2 * 60 * 60 * 1000; // 2 hrs
    const REFRESH_TOKEN_LIMIT = 2 * 24 * 60 * 60 * 1000; // 2 days

    const accessToken = await generateToken(user.id, ACCESS_TOKEN_LIMIT);
    const refreshToken = await generateToken(user.id, REFRESH_TOKEN_LIMIT);

    // Access token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_LIMIT,
    });

    // Refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_LIMIT,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Logout
export const onLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful!" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get user details
export const onGetUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      // @ts-ignore
      _id: req.userId,
    });
    if (!user) {
      res.status(400).json({ error: "User not found!" });
      return;
    }

    res
      .status(200)
      .json({ name: user.name, email: user.email, avatar: user.avatar });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Refresh the access token
export const onRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(404).json({ error: "Refresh token is empty!" });
    return;
  }

  try {
    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET!);

    // Decoded validation
    if (typeof decoded === "string" || !decoded.id) {
      res.status(401).json({ error: "Invalid refresh token!" });
      return;
    }

    // Issuing new accessToken
    const ACCESS_TOKEN_LIMIT = 2 * 60 * 60 * 1000; // 2 hrs
    const REFRESH_TOKEN_LIMIT = 2 * 24 * 60 * 60 * 1000; // 2 days

    const newAccessToken = await generateToken(decoded.id, ACCESS_TOKEN_LIMIT);
    const newRefreshToken = await generateToken(
      decoded.id,
      REFRESH_TOKEN_LIMIT,
    );

    // Access token
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_LIMIT,
    });

    // Refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_LIMIT,
    });

    res.status(200).json({ message: "Token refresh successful!" });
  } catch (error) {
    res.status(400).json({ error: "Refresh token failed!" });
    return;
  }
};
