import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "../domain";

export const MessageMongooseModule = MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]);
