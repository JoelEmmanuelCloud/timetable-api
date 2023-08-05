import { IUser, AcademyRole } from '../models/user';
import CustomError from '../errors'; 

const checkPermissions = (requestUser: IUser, resourceUserId: string | number) => {
  if (requestUser.academyRole === AcademyRole.Lecturer) return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

export default checkPermissions;
