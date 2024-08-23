import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "../domain/JwtPayload";
import { secrets } from "../../../Domain/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secrets.JWT_SECRET,
    });
  }

  public readonly validate = async ({ id, rol }: JwtPayload): Promise<JwtPayload> => {
    return { id, rol } as const;
  };
}
