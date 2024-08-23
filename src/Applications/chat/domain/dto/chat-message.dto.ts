import { IsNotEmpty, IsString, Matches } from "class-validator";

interface ChatMessage {
  chatId: string;
  sender: string;
  receiver: string;
  content: string;
}

export class ChatMessageDto implements ChatMessage {
  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  chatId: string;

  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  sender: string;

  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  receiver: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  constructor(d: ChatMessage) {
    this.chatId = d.chatId;
    this.sender = d.sender;
    this.receiver = d.receiver;
    this.content = d.content;
  }
}
