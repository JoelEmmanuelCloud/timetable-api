import { Request, Response } from 'express'; // If you are using Express for your app
import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse, createTokenUser, createJWT } from '../utils';
import User from '../models/user';
import CustomError from '../errors';


const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const academyRole = isFirstAccount ? 'timetableOfficer' : 'student';

  const user = await User.create({ name, email, password, academyRole });
  const tokenUser = createTokenUser(user);


  const userObject = user.toJSON();

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: userObject });
};

export default register;

