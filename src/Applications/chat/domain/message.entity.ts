import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as SchemaMongoose, HydratedDocument } from "mongoose";

@Schema()
export class Message {
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: "Chat", required: true })
  chat: string;

  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: "User", required: true })
  sender: string;

  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: "User", required: true })
  receiver: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Boolean, default: false })
  isStarred: boolean;

  @Prop({ type: Boolean, default: false })
  isTrashed: boolean;

  @Prop({ type: [{ type: String }] })
  attachments: string[]; // Files URL or ID
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
