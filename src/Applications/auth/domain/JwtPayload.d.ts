import { Rol } from "../../users/domain/IUser";

export interface JwtPayload {
  id: string;
  rol: Rol;
}
