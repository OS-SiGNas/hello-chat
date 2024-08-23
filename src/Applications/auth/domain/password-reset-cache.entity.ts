import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class PasswordResetCache {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  verificationString: string;

  @Prop({ expires: "1h" })
  createdAt: Date;
}

export type PasswordResetDocument = HydratedDocument<PasswordResetCache>;
export const PasswordResetCacheSchema = SchemaFactory.createForClass(PasswordResetCache);
