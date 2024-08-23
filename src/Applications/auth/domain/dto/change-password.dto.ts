import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  verificationString: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
