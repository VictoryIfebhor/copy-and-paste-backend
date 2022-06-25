import { NotFound } from "../errors/exceptions.js";

export const notFoundMiddleware = (req, res) => {
  throw new NotFound("Route does not exists");
};
