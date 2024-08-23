import { IsNotEmpty, IsEmail, IsString, Min, Max } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Min(8)
  @Max(64)
  password: string;
}
