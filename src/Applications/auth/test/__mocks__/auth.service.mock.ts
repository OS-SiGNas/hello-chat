import { User } from "src/Applications/users/domain";
import { ChangePasswordDto, LoginDto, RegisterDto, UserSessionDto } from "../../domain";
import { mockUsersDb } from "./usersDb.mock";

const verificationsStrings: string[] = [];

export const mockAuthService = {
  login: jest.fn(async ({ email, password }: LoginDto): Promise<UserSessionDto | null> => {
    const user = mockUsersDb.find((user) => user.email === email);
    if (user === undefined) return null;
    if (user.password !== password) return null;
    return new UserSessionDto({
      token: "",
      id: "",
      email: user.email,
      name: user.name,
      roles: user.roles,
      createAt: user.createdAt,
      chats: user.chats,
      contacts: user.contacts,
    });
  }),

  register: jest.fn(async (register: RegisterDto): Promise<boolean> => {
    const user: User = {
      chats: [],
      contacts: [],
      createdAt: new Date(),
      email: register.email,
      isActive: false,
      name: register.name,
      password: register.password,
      roles: ["standard"],
      activationToken: "activationToken123",
    };
    mockUsersDb.push(user);
    return await Promise.resolve(mockUsersDb[mockUsersDb.length - 1].email === register.email);
  }),

  activateAccount: jest.fn(async (token: string): Promise<boolean> => {
    if (mockUsersDb[mockUsersDb.length - 1].activationToken !== token) return false;
    mockUsersDb[mockUsersDb.length - 1].isActive = true;
    return await Promise.resolve(mockUsersDb[mockUsersDb.length - 1].isActive);
  }),

  forgotPassword: jest.fn(async (email: string): Promise<string | null> => {
    const user = mockUsersDb.find((user) => user.email === email);
    if (user === undefined) return null;
    const verificationString = "verificationString12345";
    verificationsStrings.push(verificationString);
    return verificationString;
  }),

  changePassword: jest.fn(async ({ email, newPassword, verificationString }: ChangePasswordDto): Promise<boolean> => {
    if (!verificationsStrings.includes(verificationString)) return false;
    const user = mockUsersDb.find((user) => user.email === email);
    if (user === undefined) return false;
    user.password = newPassword;
    return await Promise.resolve(user.password === newPassword);
  }),
};
