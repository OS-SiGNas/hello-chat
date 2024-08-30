import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { accessKeys } from "../decorators/protected.decorator";

import type { Roles } from "src/Applications/users/domain";

@Injectable()
export class RolesGuard implements CanActivate {
  readonly #logger = new Logger(this.constructor.name);
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Roles>(accessKeys.IS_PROTECTED, [context.getHandler(), context.getClass()]);
    const { user, url } = context.switchToHttp().getRequest();

    if (user.roles.includes("admin")) return true;
    if (user.roles.includes(role)) return true;

    this.#logger.warn(`💀 User [${user.roles.join(", ")}](${user.id}): attempted to access resource [${role}]:${url}`);
    return false;
  }
}
