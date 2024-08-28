import { Rol } from "../../users/domain";

export interface PayloadToken {
  id: string;
  rol: Rol;
}
