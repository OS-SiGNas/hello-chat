import { User, UserDocument } from "../../../users/domain";
import { mockUsersDb } from "../__mocks__/usersDb.mock";
import { encryptPassword } from "../../applications";

export const mockUserModel = {
  findOne: jest.fn(async (target: UserDocument) => {
    const user = mockUsersDb.find((user) => user.email === target.email);
    if (user === undefined) return null;
    return Promise.resolve({
      ...user,
      id: "",
      password: await encryptPassword(user.password),
      save: jest.fn(),
    });
  }),

  findOneAndUpdate: jest.fn(async (target: { email: string }, changes: UserDocument) => {
    const user = mockUsersDb.find((user) => user.email === target.email);
    if (user === undefined) return null;
    return Promise.resolve({
      ...user,
      ...changes,
      save: jest.fn(),
    });
  }),

  create: jest.fn(async (user: User) => {
    mockUsersDb.push(user);
    return user;
  }),
};
