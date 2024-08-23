import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, HydratedDocument } from "mongoose";

@Schema()
export class Chat {
  @Prop({ type: Boolean, required: true, default: false })
  isGroup: boolean;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Map, of: [{ type: MongooseSchema.Types.ObjectId, ref: "Message" }] })
  messagesByUser: Map<string, string[]>;
}

export type ChatDocument = HydratedDocument<Chat>;
export const ChatSchema = SchemaFactory.createForClass(Chat);
