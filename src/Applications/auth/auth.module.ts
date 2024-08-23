import { Module } from "@nestjs/common";

import { UserMongooseModule } from "../users/domain";

import { AuthService, JwtStrategy, JwtConfigModule } from "./applications";
import { PasswordMongooseModule } from "./domain";
import { AuthController } from "./infrastructure";

@Module({
  imports: [UserMongooseModule, PasswordMongooseModule, JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
