import { User } from './interfaces';

declare module 'express' {
    interface Request {
        user?: User;
    }
}
