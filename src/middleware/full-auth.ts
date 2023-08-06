// import { Request, Response, NextFunction } from 'express';
// import CustomError from '../errors';
// import { isTokenValid, Payload } from '../utils/jwt'; // Assuming the correct import path and the Payload type from the utils/jwt module.

// interface UserPayload {
//   userId: string;
//   role: string;
// }

// interface CustomRequest extends Request {
//   user?: UserPayload;
// }

// const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
//   let token;
//   // check header
//   const authHeader = req.headers.authorization;
//   if (authHeader && authHeader.startsWith('Bearer')) {
//     token = authHeader.split(' ')[1];
//   }
//   // check cookies
//   else if (req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     throw new CustomError.UnauthenticatedError('Authentication invalid');
//   }

//   try {
//     const payload: Payload | string = isTokenValid(token);

//     if (typeof payload === 'string') {
//       throw new CustomError.UnauthenticatedError(payload); // Throw the error message directly.
//     }

//     // Attach the user and his permissions to the req object
//     req.user = {
//       userId: payload.user.userId,
//       role: payload.user.role,
//     };

//     next();
//   } catch (error) {
//     throw new CustomError.UnauthenticatedError('Authentication invalid');
//   }
// };

// const authorizeRoles = (...roles: string[]) => {
//   return (req: CustomRequest, res: Response, next: NextFunction) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       throw new CustomError.UnauthorizedError(
//         'Unauthorized to access this route'
//       );
//     }
//     next();
//   };
// };

// export { authenticateUser, authorizeRoles };
