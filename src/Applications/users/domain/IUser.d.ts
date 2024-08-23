export type Rol = "admin" | "standard" | "moderator" | "tester" | "null";
export interface IUser {
  name: string;
  email: string;
  password: string;
  rol: Rol;
  isActive: boolean;
  createdAt: Date;
}
