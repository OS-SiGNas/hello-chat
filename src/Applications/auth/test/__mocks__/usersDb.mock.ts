import { User } from "../../../users/domain";

const date = new Date();

export const mockUsersDb: User[] = [
  {
    isActive: true,
    name: "signas",
    email: "signas13@gmail.com",
    password: "abc123",
    createdAt: date,
    rol: "admin",
    chats: [],
    contacts: [],
  },
  {
    isActive: false,
    name: "signas",
    email: "signas14@gmail.com",
    password: "abc123",
    createdAt: date,
    rol: "standard",
    chats: [],
    contacts: [],
  },
  {
    isActive: true,
    name: "signas",
    email: "signas15@gmail.com",
    password: "abc123",
    createdAt: date,
    rol: "moderator",
    chats: [],
    contacts: [],
  },
  {
    isActive: true,
    name: "signas",
    email: "signas16@gmail.com",
    password: "abc123",
    createdAt: date,
    rol: "tester",
    chats: [],
    contacts: [],
  },
];
