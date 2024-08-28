import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { accessKeys } from "../decorators/protected.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride(accessKeys.IS_PROTECTED, [context.getHandler(), context.getClass()]);
    const { user } = context.switchToHttp().getRequest();
    if (user.rol === "admin") return true;
    return role === user.rol ? true : false;
  }
}
