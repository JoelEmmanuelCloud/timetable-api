import {User} from '../interfaces/index'; 

const createTokenUser = (user: User): User => {
  return { ...user };
};

export = createTokenUser;
