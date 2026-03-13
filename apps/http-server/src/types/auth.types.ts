import { z } from "zod";

export const SignupReqBody = z.object({
  name: z.string().min(2).max(100),
  email: z.email().min(2).max(100),
  password: z.string().min(2).max(100),
  avatar: z.string().min(2).max(200),
});

export const LoginReqBody = z.object({
  email: z.email().min(2).max(100),
  password: z.string().min(2).max(100),
});
