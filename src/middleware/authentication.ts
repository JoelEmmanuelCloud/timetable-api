import CustomError from '../errors';
import { AcademyRole } from '../interfaces';
import { isTokenValid } from '../utils';
import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../interfaces';

const authenticateUser = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
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

const authorizePermissions = (...roles: AcademyRole[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.academyRole)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
