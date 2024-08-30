import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from ".";

export const ChatMongooseModule = MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]);
