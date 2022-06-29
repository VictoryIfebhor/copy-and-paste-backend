import express from "express";
import {
  addItem,
  editItem,
  getAllItems,
  removeItem,
} from "../controllers/item.controller.js";
import { authMiddleware } from "../middlewares/auth-handler.js";
import {} from "../routers/item.router.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(getAllItems).post(addItem);
router.route("/:id").patch(editItem).delete(removeItem);

export default router;
