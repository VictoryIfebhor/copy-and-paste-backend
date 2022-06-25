import mongoose from "mongoose";
import { CustomHttpError } from "../errors/exceptions.js";

const { Error: MongooseError } = mongoose;

export const errorHandlerMIddleware = (err, req, res, next) => {
  console.log(err.message);
  if (err instanceof CustomHttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof MongooseError.ValidationError) {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  if (err instanceof MongooseError.CastError) {
    const path = err.path === "_id" ? "id" : err.path;
    return res.status(400).json({ message: `${path} expects ${err.kind}` });
  }
  if (err.code && err.code === 11000) {
    return res
      .status(400)
      .json({ message: `${Object.keys(err.keyValue)} already exists.` });
  }
  res.status(500).json({ message: "Internal Server Error" });
};
