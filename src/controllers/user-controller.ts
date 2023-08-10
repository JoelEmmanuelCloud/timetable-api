import { handleAsyncError } from '../middleware';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import CustomError from '../errors';
import User from '../models/user';
import { ExtendedRequest } from '../interfaces';
import {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} from '../utils';

const getAllUsers = async (
    req: ExtendedRequest,
    res: Response,
): Promise<void> => {
    await handleAsyncError(async () => {
        const users = await User.find({
            academyRole: { $in: ['lecturer', 'student'] },
        }).select('-password');

        res.status(StatusCodes.OK).json({ users });
    }, res);
};

const getSingleUser = async (
    req: ExtendedRequest,
    res: Response,
): Promise<void> => {
    await handleAsyncError(async () => {
        const user = await User.findOne({ _id: req.params.id }).select(
            '-password',
        );

        if (!user) {
            throw new CustomError.NotFoundError(
                `No user with id : ${req.params.id}`,
            );
        }

        if (!req.user) {
            throw new CustomError.UnauthenticatedError(
                'User not authenticated',
            );
        }

        checkPermissions(req.user, user._id);

        res.status(StatusCodes.OK).json({ user });
    }, res);
};

const showCurrentUser = async (
    req: ExtendedRequest,
    res: Response,
): Promise<void> => {
    await handleAsyncError(async () => {
        if (!req.user) {
            throw new CustomError.UnauthenticatedError(
                'User not authenticated',
            );
        }

        res.status(StatusCodes.OK).json({ user: req.user });
    }, res);
};

const updateUser = async (
    req: ExtendedRequest,
    res: Response,
): Promise<void> => {
    await handleAsyncError(async () => {
        const { email, name } = req.body;
        if (!email || !name) {
            throw new CustomError.BadRequestError('Please provide all values');
        }

        if (!req.user) {
            throw new CustomError.UnauthenticatedError(
                'User not authenticated',
            );
        }

        const userId = req.user._id;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            throw new CustomError.NotFoundError('User not found');
        }

        user.email = email;
        user.name = name;

        await user.save();

        const userObject = user.toJSON();
        const tokenUser = createTokenUser(userObject);
        attachCookiesToResponse({ res, user: tokenUser });

        res.status(StatusCodes.OK).json({ user: tokenUser });
    }, res);
};

const updateUserPassword = async (
    req: ExtendedRequest,
    res: Response,
): Promise<void> => {
    await handleAsyncError(async () => {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw new CustomError.BadRequestError('Please provide both values');
        }

        if (!req.user) {
            throw new CustomError.UnauthenticatedError(
                'User not authenticated',
            );
        }

        const userId = req.user._id;
        const user = await User.findOne({ _id: userId });

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
    }, res);
};

export {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};
