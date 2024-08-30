import type { User } from "../../../users/domain";

interface MockUser extends User {
  id: string;
}

const date = new Date();

const mockUsersDb: MockUser[] = [
  { id: "0001", isActive: true, name: "signas13", email: "signas13@gmail.com", password: "abc123", createdAt: date, roles: ["admin"], chats: [], contacts: [] },
  {
    id: "0002",
    isActive: false,
    name: "signas14",
    email: "signas14@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["standard"],
    chats: [],
    contacts: [],
  },
  {
    id: "0003",
    isActive: true,
    name: "signas15",
    email: "signas15@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["moderator"],
    chats: [],
    contacts: [],
  },
  {
    id: "0004",
    isActive: true,
    name: "signas16",
    email: "signas16@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["tester"],
    chats: [],
    contacts: [],
  },
];

export const mockUserModel = {
  findById: jest.fn(async (id: string) => {
    const user = mockUsersDb.find((user) => user.id === id);
    if (user === undefined) return null;
    return await Promise.resolve({ ...user, save: jest.fn() });
  }),

  create: jest.fn(async () => {}),
};
