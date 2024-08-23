import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../auth/applications";
import { UserMongooseModule } from "../users/domain";

import { ChatService } from "./applications/";
import { ChatMongooseModule, MessageMongooseModule } from "./domain/";
import { ChatGateway } from "./infrastructure";

@Module({
  imports: [UserMongooseModule, MessageMongooseModule, ChatMongooseModule, JwtConfigModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
