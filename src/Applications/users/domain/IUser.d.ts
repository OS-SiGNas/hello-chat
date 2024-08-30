import type { Roles } from "./Roles";

export interface IUser {
  name: string;
  email: string;
  password: string;
  roles: Roles[];
  isActive: boolean;
  createdAt: Date;
  chats: string[];
  contacts: string[];
}
