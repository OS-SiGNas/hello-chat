import { IsNotEmpty, IsEmail, IsString } from "class-validator";
import { Rol } from "../IUser";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  rol: Rol;
}
