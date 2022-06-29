import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/exceptions.js";
import Item from "../model/item.model.js";

export const getAllItems = async (req, res) => {
  const { _id } = req.user;
  const users = await Item.find({ user: _id });
  res.status(StatusCodes.OK).json({ users });
};

export const addItem = async (req, res) => {
  const { _id } = req.user;
  const { title, content } = req.body;
  const item = await Item.create({ title, content, user: _id });
  res.status(StatusCodes.CREATED).json({ item });
};

export const removeItem = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const item = await Item.findOneAndDelete({ _id: id, user: _id });
  if (!item) {
    throw new NotFound("No such item exists for this user");
  }
  res.status(StatusCodes.NO_CONTENT);
};

export const editItem = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { title, content } = req.body;
  const item = await Item.findOneAndUpdate(
    { _id: id, user: _id },
    { title, content },
    { new: true, runValidators: true }
  );
  if (!item) {
    throw new NotFound("No such item exists for this user");
  }
  res.status(StatusCodes.OK).json({ item });
};
