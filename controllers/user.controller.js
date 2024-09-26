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

export const loginUserWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    throw new BadRequest("Email and password must be provided");
  }

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Invalid credentials");
  }

  // Check if the password matches
  if (password !== process.env.FIXED_PASSWORD) {
    throw new Unauthorized("Invalid credentials");
  }

  // Generate a token if the login is successful
  const token = user.generateToken();

  // Respond with user data and token
  res.status(StatusCodes.OK).json({
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    token,
  });
};

export const currentUserInfo = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).populate("items");
  res.status(StatusCodes.OK).json({ user });
};
