import { User } from './interfaces/userTypes';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
