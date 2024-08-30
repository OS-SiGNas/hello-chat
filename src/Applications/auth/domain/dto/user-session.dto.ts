import { Roles } from "../../../users/domain";

interface Dependences {
  token: string;
  id: string;
  name: string;
  email: string;
  roles: Roles[];
  createAt: Date;
  contacts: string[];
  chats: string[];
}

export class UserSessionDto {
  token: string;
  email: string;
  id: string;
  name: string;
  roles: Roles[];
  createdAt: Date;
  chats: string[];
  contacts: string[];

  constructor(d: Readonly<Dependences>) {
    this.token = d.token;
    this.name = d.name;
    this.id = d.id;
    this.email = d.email;
    this.roles = d.roles;
    this.createdAt = d.createAt;
    this.chats = d.chats;
    this.contacts = d.contacts;
  }
}
