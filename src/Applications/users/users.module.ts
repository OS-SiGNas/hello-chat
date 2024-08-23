import { Module } from "@nestjs/common";

import { UsersService } from "./applications";
import { UserMongooseModule } from "./domain";
import { UsersController } from "./infrastructure";

@Module({
  imports: [UserMongooseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
