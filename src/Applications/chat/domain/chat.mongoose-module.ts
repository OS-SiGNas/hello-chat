import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "../domain";

export const ChatMongooseModule = MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]);
