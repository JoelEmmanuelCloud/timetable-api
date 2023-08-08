import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import CustomError from '../errors';
import User from '../models/user';
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from '../utils';

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }

  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }

  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }

  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
