import { Request, Response } from 'express';

const register = async (req: Request, res: Response): Promise<void> => {
    res.send('register');
};

const login = async (req: Request, res: Response): Promise<void> => {
    res.send('login');
};

const logout = async (req: Request, res: Response): Promise<void> => {
    res.send('logout');
};

export default {
    register,
    login,
    logout,
};
