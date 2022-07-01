import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/exceptions.js";
import Item from "../model/item.model.js";

export const getAllItems = async (req, res) => {
  const { id } = req.user;
  const items = await Item.find({ user: id });
  res.status(StatusCodes.OK).json({ items });
};

export const addItem = async (req, res) => {
  const { id: user } = req.user;
  const { title, content } = req.body;
  console.log(req.user);
  const item = await Item.create({ title, content, user });
  res.status(StatusCodes.CREATED).json({ item });
};

export const removeItem = async (req, res) => {
  const { id: user } = req.user;
  const { id: _id } = req.params;
  const item = await Item.findOneAndDelete({ _id, user });
  if (!item) {
    throw new NotFound("No such item exists for this user");
  }
  res.sendStatus(StatusCodes.NO_CONTENT);
};

export const editItem = async (req, res) => {
  const { id: user } = req.user;
  const { id: _id } = req.params;
  const { title, content } = req.body;
  const item = await Item.findOneAndUpdate(
    { _id, user },
    { title, content },
    { new: true, runValidators: true }
  );
  if (!item) {
    throw new NotFound("No such item exists for this user");
  }
  res.status(StatusCodes.OK).json({ item });
};
