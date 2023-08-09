import CustomError from '../errors';

import { User as IUser, AcademyRole } from '../interfaces';

const checkPermissions = (requestUser: IUser, resourceUserId: string): void => {
  
  if (requestUser.academyRole === AcademyRole.TimetableOfficer) return;
  if (requestUser.userId === resourceUserId) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

export default checkPermissions;
