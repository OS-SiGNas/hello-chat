import { JwtModule } from "@nestjs/jwt";
import { secrets } from "../../../Domain/config";

export const JwtConfigModule = JwtModule.register({
  global: true,
  secret: secrets.JWT_SECRET,
  signOptions: { expiresIn: secrets.JWT_EXPIRED_TIME },
});
