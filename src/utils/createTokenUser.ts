import { IUser } from '../models/user';

const createTokenUser = (user: IUser) => {
  return { name: user.name, userId: user._id, academyRole: user.academyRole };
};

export default createTokenUser;
