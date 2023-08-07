import CustomError from '../errors';

import { User as IUser, AcademyRole } from '../interfaces/index';

const checkPermissions = (requestUser: IUser, resourceUserId: string): void => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.academyRole === AcademyRole.TimetableOfficer) return;
  if (requestUser.userId === resourceUserId) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

export default checkPermissions;
