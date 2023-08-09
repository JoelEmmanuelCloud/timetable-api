import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors';
import User from '../models/user';
import { ExtendedRequest } from '../interfaces';
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from '../utils';


const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({
            academyRole: { $in: ['lecturer', 'student'] }
        }).select('-password');

        res.status(StatusCodes.OK).json({ users });
    } catch (error) {
        console.error(error); 

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
};


const getSingleUser = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ _id: req.params.id }).select('-password');
      if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
      }
  
      if (!req.user) {
        throw new CustomError.UnauthenticatedError('User not authenticated');
      }
  
      checkPermissions(req.user, user._id);
      res.status(StatusCodes.OK).json({ user });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };


const showCurrentUser = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError.UnauthenticatedError('User not authenticated');
        }

        res.status(StatusCodes.OK).json({ user: req.user });
    } catch (error) {
        console.error(error); 
        if (error instanceof CustomError.UnauthenticatedError) {
            res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
        }
    }
};



// const updateUser = async (req: Request, res: Response): Promise<void> => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please provide all values');
//   }

//   if (!req.user) {
//     throw new CustomError.UnauthenticatedError('User not authenticated');
//   }

//   const user = await User.findOne({ _id: req.user.userId });

//   if (!user) {
//     throw new CustomError.NotFoundError('User not found');
//   }

//   user.email = email;
//   user.name = name;

//   await user.save();

//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };


const updateUserPassword = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        
        throw new CustomError.BadRequestError('Please provide both values');
        
      }
  
      if (!req.user) {
        
        throw new CustomError.UnauthenticatedError('User not authenticated');
        
      }
      const userId = req.user.userId;
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        console.log(user);
        console.log(req.user);
        console.log(req.user.userId);
        throw new CustomError.NotFoundError('User not found');
      }
  
      const isPasswordCorrect = await user.comparePassword(oldPassword);
      if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
  
      user.password = newPassword;
  
      await user.save();
      res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
//   updateUser,
  updateUserPassword,
};
