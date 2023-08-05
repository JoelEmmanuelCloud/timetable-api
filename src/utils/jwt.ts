import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface Payload extends IUser {
  [key: string]: any;
}

const createJWT = ({ payload }: { payload: Payload }): string => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }: { token: string }): Payload | string => {
  const decodedToken = jwt.verify(token, JWT_SECRET) as Payload;
  return decodedToken ? decodedToken : 'Invalid token';
};

const attachCookiesToResponse = ({ res, user }: { res: Response; user: IUser }): void => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
