import { User } from '../proto/user/user_pb';

export type UserAsPlainObject = {
  id: string;
  data: { [key: string]: string };
};

export function createUser(plainObj: UserAsPlainObject): User {
  const user = new User();
  user.setId(plainObj.id);
  Object.entries(plainObj.data).forEach(([key, value]) => {
    const m = user.getDataMap().set(key, value);
  });
  return user;
}
