import { IsNotEmpty, IsEmail, IsString, IsArray, ArrayNotEmpty, IsIn } from "class-validator";
import { Roles, rolesArray } from "../Roles";

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
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(rolesArray, { each: true })
  roles: Roles[];
}
