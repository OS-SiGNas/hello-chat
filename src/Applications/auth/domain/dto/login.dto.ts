import { IsNotEmpty, IsEmail, IsString, IsAscii, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsAscii()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
