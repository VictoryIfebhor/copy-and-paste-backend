import { StatusCodes } from "http-status-codes";
import { BadRequest } from "../errors/exceptions.js";
import User from "../model/user.model.js";
import { getPayloadFromGoogle } from "../util/google-client.js";

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
  } = await getPayloadFromGoogle(credential);

  let statusCode = StatusCodes.OK;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, image });
    statusCode = StatusCodes.CREATED;
  }
  const token = user.generateToken();
  //   const maxAge = 24 * 60 * 60 * 1000;
  //   res.cookie("jwt", token, { maxAge, httpOnly: true });
  res.status(statusCode).json({ ...user, token });
};

export const currentUserInfo = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).populate("items");
  res.status(StatusCodes.OK).json({ user });
};
