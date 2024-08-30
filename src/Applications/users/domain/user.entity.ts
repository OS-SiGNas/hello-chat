import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as SchemaMongoose, HydratedDocument } from "mongoose";

import type { Roles } from "./Roles";
import type { IUser } from "./IUser";

@Schema()
export class User implements IUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: Array })
  roles: Roles[];

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ expires: "1h" })
  activationToken?: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop([{ type: SchemaMongoose.Types.ObjectId, ref: "Chat" }])
  chats: string[];

  @Prop([{ type: SchemaMongoose.Types.ObjectId, ref: "User" }])
  contacts: string[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
