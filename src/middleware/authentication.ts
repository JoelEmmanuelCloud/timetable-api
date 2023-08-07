import CustomError from '../errors';
import { isTokenValid } from '../utils';

import { Request, Response, NextFunction } from 'express';

const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const { name, userId, academyRole } = isTokenValid({ token });
    req.user = { name, userId, academyRole };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

export default authenticateUser;
