import { StatusCodes } from "http-status-codes";
import { BadRequest } from "../errors/exceptions.js";
import User from "../model/user.model.js";
import { getPayload } from "../util/google-client.js";

export const authenticateUser = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new BadRequest("credentials must be provided as body parameter");
  }

  const {
    given_name,
    family_name,
    name,
    email,
    picture: image,
  } = getPayload(credential);

  let statusCode = StatusCodes.OK;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, image });
    statusCode = StatusCodes.CREATED;
  }
  const token = user.generateToken();
  //   const maxAge = 24 * 60 * 60 * 1000;
  //   res.cookie("jwt", token, { maxAge, httpOnly: true });
  res.status(statusCode).json({ name, email, image, token });
};

export const currentUserInfo = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).populate("items");
  res.status(StatusCodes.OK).json({ user });
};
