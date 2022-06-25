import jwt from "jsonwebtoken";
import { Unauthenticated } from "../errors/exceptions.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [_, token] = authorization.split(" ");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, image } = payload;
    req.user = { name, email, image };
  } catch (error) {
    throw new Unauthenticated("Could not authenticate user");
  }
  next();
};
