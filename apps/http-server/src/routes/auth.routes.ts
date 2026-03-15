import { Router } from "express";
import {
  onGetToken,
  onGetUser,
  onLogin,
  onLogout,
  onRefreshToken,
  onSignup,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter: Router = Router();

authRouter.post("/signup", onSignup);
authRouter.post("/login", onLogin);
authRouter.post("/logout", onLogout);
authRouter.post("/refresh_token", onRefreshToken);

authRouter.get("/me", authenticate, onGetUser);
authRouter.post("/get_token", authenticate, onGetToken);

export default authRouter;
