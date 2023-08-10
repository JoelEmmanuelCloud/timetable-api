import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const handleAsyncError = async (func: Function, res: Response): Promise<void> => {
    try {
        await func();
    } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};
