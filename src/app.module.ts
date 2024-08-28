import { Module } from "@nestjs/common";

import { configModule } from "./Domain/config-module";

import { AuthModule } from "./Applications/auth/auth.module";
import { UsersModule } from "./Applications/users/users.module";
import { ChatModule } from "./Applications/chat/chat.module";
import { DatabaseModule } from "./Infrastructure/database.module";

@Module({ imports: [configModule, DatabaseModule, AuthModule, UsersModule, ChatModule] })
export class AppModule {}
