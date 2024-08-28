import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { Rol } from "src/Applications/users/domain";

export const accessKeys = {
  IS_PUBLIC: Symbol(),
  IS_PROTECTED: Symbol(),
} as const;

export const Public = (): CustomDecorator<symbol> => SetMetadata(accessKeys.IS_PUBLIC, true);
export const Protected = (rol: Rol): CustomDecorator<symbol> => SetMetadata(accessKeys.IS_PROTECTED, rol);
