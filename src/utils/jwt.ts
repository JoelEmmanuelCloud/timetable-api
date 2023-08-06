import jwt from 'jsonwebtoken';
import { Response } from '../interfaces/authTypes';

import {User} from '../interfaces/userTypes'

type Payload = User

const createJWT = ({ payload }: { payload: Payload }): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME!,
  });
  return token;
};

const isTokenValid = ({ token }: { token: string }): Payload => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as Payload;
  return decodedToken;
};

const attachCookiesToResponse = ({ res, user }: { res: Response; user: Payload }): void => {
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
