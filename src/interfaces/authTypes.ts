import { AcademyRole } from "./userTypes";


export interface Payload {
    userId: string;
    name: string;
    email: string;
    academyRole: AcademyRole;
  }
  
  interface CookieOptions {
    httpOnly: boolean;
    expires: Date;
    secure: boolean;
    signed: boolean;
  }
  
  export interface Response {
    cookie(name: string, value: string, options: CookieOptions): void;
  }
  