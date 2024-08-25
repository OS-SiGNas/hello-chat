import { IsBoolean, IsNotEmpty, IsOptional, Matches } from "class-validator";

interface MarkMessage {
  userId: string;
  messageId: string;
  isRead: boolean;
  isStarred: boolean;
}

export class MarkMessageDto {
  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  userId: string;

  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  messageId: string;

  @IsOptional()
  @IsBoolean()
  isRead: boolean;

  @IsOptional()
  @IsBoolean()
  isStarred: boolean;

  constructor(p: MarkMessage) {
    this.messageId = p.messageId;
    this.isRead = p.isRead;
    this.isStarred = p.isStarred;
    this.userId = p.userId;
  }
}
