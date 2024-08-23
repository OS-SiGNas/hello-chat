import { IsNotEmpty, IsString, Matches } from "class-validator";

interface NewChat {
  sender: string;
  receiver: string;
}

export class NewChatDto implements NewChat {
  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  sender: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-f\d]{24}$/i)
  receiver: string;

  constructor(d: NewChat) {
    this.sender = d.sender;
    this.receiver = d.receiver;
  }
}
