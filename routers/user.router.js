import express from "express";
import {
  authenticateUser,
  currentUserInfo,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth-handler.js";

const router = express.Router();

router.post("/auth", authenticateUser);
router.get("/me", authMiddleware, currentUserInfo);

export default router;
