import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { secrets } from "../../../../Domain/config-module";

import { PayloadToken } from "../../domain";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: secrets.JWT_SECRET, ignoreExpiration: false });
  }

  public readonly validate = async ({ id, roles }: PayloadToken): Promise<PayloadToken> => {
    return { id, roles } as const;
  };
}
