import {User} from '../interfaces/userTypes'; 

const createTokenUser = (user: User): User => {
  return { ...user };
};

export = createTokenUser;
