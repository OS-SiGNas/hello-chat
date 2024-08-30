import type { Roles } from "../../users/domain";

export interface PayloadToken {
  id: string;
  roles: Roles;
}
