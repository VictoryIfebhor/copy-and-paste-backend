import express from "express";
import {
  authenticateUser,
  loginUserWithEmailPassword,
  currentUserInfo,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth-handler.js";

const router = express.Router();

router.post("/auth", authenticateUser);
router.post("/login", loginUserWithEmailPassword);
router.get("/me", authMiddleware, currentUserInfo);

export default router;
