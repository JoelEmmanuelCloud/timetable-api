import {User} from '../interfaces'; 

const createTokenUser = (user: User): User => {
  return { ...user };
};

export = createTokenUser;
