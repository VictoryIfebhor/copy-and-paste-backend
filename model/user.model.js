import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Must provide user's name"],
    },
    email: {
      type: String,
      required: [true, "Must provide user's email"],
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "user",
  justOne: false,
  options: { sort: "-createdAt" },
});

UserSchema.pre("remove", async function (next) {
  await this.model("Item").deleteMany({ user: this._id });
  next();
});

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, name: this.name, image: this.image },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

export default mongoose.model("User", UserSchema);
