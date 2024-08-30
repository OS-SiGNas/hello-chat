import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { Roles } from "../../../users/domain";

export const accessKeys = {
  IS_PUBLIC: Symbol(),
  IS_PROTECTED: Symbol(),
} as const;

export const Public = (): CustomDecorator<symbol> => SetMetadata(accessKeys.IS_PUBLIC, true);
export const Protected = (role: Roles): CustomDecorator<symbol> => SetMetadata(accessKeys.IS_PROTECTED, role);
