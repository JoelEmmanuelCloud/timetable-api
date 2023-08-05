import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';

const register = async (req: Request, res: Response): Promise<void> => {
    
        const user: IUser = await User.create(req.body);
        res.status(StatusCodes.CREATED).json({ user });
    }

const login = async (req: Request, res: Response): Promise<void> => {
    res.send('login');
};

const logout = async (req: Request, res: Response): Promise<void> => {
    res.send('logout');
};

export {
    register,
    login,
    logout
};
