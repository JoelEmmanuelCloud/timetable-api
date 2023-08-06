import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user'; // Assuming you have a user model defined and exported in a separate file
import CustomError from '../errors'; // Assuming you have a custom error class defined and exported in a separate file
import { IUser } from '../interfaces/userTypes'

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const emailAlreadyExist: IUser | null = await User.findOne({ email });
    if (emailAlreadyExist) {
      throw new CustomError.BadRequestError('Email already exists');
    }

    const user: IUser = await User.create(req.body);

    const userWithoutPassword: Partial<IUser> = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.status(StatusCodes.CREATED).json({ user: userWithoutPassword });
  } catch (error) {
    // Assuming you have error handling middleware in place to catch the error and send an appropriate response.
    // If not, you can use res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    // to send a generic error response.
    next(error);
  }
};

export default register;
