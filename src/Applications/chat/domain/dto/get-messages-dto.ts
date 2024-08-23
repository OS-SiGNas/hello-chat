import { IsEnum, IsNotEmpty, IsOptional, Matches } from "class-validator";

interface GetMessages {
  userId: string;
  chatId: string;
  filter?: "unread" | "starred";
  cursor?: string;
}

export class GetMessagesDto implements GetMessages {
  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  chatId: string;

  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  userId: string;

  @IsOptional()
  @IsEnum(["unread", "starred"])
  filter?: "unread" | "starred";

  @IsOptional()
  @Matches(/^[a-f\d]{24}$/i)
  cursor?: string;

  constructor(d: GetMessages) {
    this.chatId = d.chatId;
    this.userId = d.userId;
    this.filter = d.filter;
    this.cursor = d.cursor;
  }
}
