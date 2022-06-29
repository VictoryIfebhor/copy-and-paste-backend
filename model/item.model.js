import mongoose from "mongoose";
import { BadRequest } from "../errors/exceptions.js";
import User from "./user.model.js";

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Must provide user that owns this item"],
  },
  title: {
    type: String,
    default: "No Title",
  },
  content: {
    type: String,
    required: [true, "Must provide content for this item"],
  },
});

ItemSchema.pre("save", async function (next) {
  const user = await User.findById(this.user);
  if (!user) {
    throw new BadRequest(
      "The user trying to save this content is not registered"
    );
  }
  next();
});

export default mongoose.model("Item", ItemSchema);
