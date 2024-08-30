import { User } from "../../../users/domain";

const date = new Date();

export const mockUsersDb: User[] = [
  {
    isActive: true,
    name: "signas",
    email: "signas13@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["admin"],
    chats: [],
    contacts: [],
  },
  {
    isActive: false,
    name: "signas",
    email: "signas14@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["standard"],
    chats: [],
    contacts: [],
  },
  {
    isActive: true,
    name: "signas",
    email: "signas15@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["moderator"],
    chats: [],
    contacts: [],
  },
  {
    isActive: true,
    name: "signas",
    email: "signas16@gmail.com",
    password: "abc123",
    createdAt: date,
    roles: ["tester"],
    chats: [],
    contacts: [],
  },
];
