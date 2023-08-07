import { AcademyRole } from "./userTypes";

  
  interface CookieOptions {
    httpOnly: boolean;
    expires: Date;
    secure: boolean;
    signed: boolean;
  }
  
  export interface Response {
    cookie(name: string, value: string, options: CookieOptions): void;
  }
  