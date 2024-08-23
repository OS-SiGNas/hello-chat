import { IsNotEmpty, IsString, IsEmail, Matches } from "class-validator";

export interface SocketAuth {
  token: string;
  name: string;
  email: string;
  userId: string;
}

export class SocketAuthDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @Matches(/^[a-f\d]{24}$/i)
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(d: SocketAuth) {
    this.userId = d.userId;
    this.token = d.token;
    this.name = d.name;
    this.email = d.email;
  }
}
