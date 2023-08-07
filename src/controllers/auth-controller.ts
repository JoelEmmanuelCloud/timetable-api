import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse, createTokenUser } from '../utils';
import User from '../models/user';
import CustomError from '../errors';
import { AcademyRole } from '../interfaces/index';


const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, academyRole } = req.body;
  
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError('Email already exists');
    }
  
    if (academyRole === AcademyRole.TimetableOfficer) {
      
      const existingTimetableOfficer = await User.findOne({ academyRole: AcademyRole.TimetableOfficer });
      if (existingTimetableOfficer) {
        throw new CustomError.BadRequestError('A Timetable Officer account already exists');
      }
    }

    if (![AcademyRole.Student, AcademyRole.Lecturer, AcademyRole.TimetableOfficer].includes(academyRole)) {
      throw new CustomError.BadRequestError('Invalid academy role');
    }
  
    const user = await User.create({ name, email, password, academyRole });
    const userObject = user.toJSON();
  
    const tokenUser = createTokenUser(userObject);
  
    attachCookiesToResponse({ res, user: tokenUser });
  
    res.status(StatusCodes.CREATED).json({ user: userObject });
  };
  




const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError(
            'Please provide email and password'
        );
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Password or Email');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Password');
    }
    const userObject = user.toJSON();
    const tokenUser = createTokenUser(userObject);
    attachCookiesToResponse({ res, user: tokenUser });
    const token = req.signedCookies.token;

    res.status(StatusCodes.OK).json({ token, user: tokenUser });
};

const logout = async (req: Request, res: Response) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'account logged out!' });
};


export { register, login, logout };



