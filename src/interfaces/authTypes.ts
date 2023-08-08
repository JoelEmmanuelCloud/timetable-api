import {User} from './userTypes'
import { Request } from 'express';

interface CookieOptions {
    httpOnly: boolean;
    expires: Date;
    secure: boolean;
    signed: boolean;
  }
  
  export interface ExtendedRequest extends Request {
    user?: User
  }



  export interface Response {
    cookie(name: string, value: string, options: CookieOptions): void;
  }
  