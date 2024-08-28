import { IsNotEmpty, IsDate, IsEmail, IsString } from "class-validator";
import { Rol } from "../../../users/domain";

interface Dependences {
  token: string;
  id: string;
  name: string;
  email: string;
  rol: Rol;
  createAt: Date;
}

export class UserSessionDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEmail()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  rol: Rol;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  constructor(d: Readonly<Dependences>) {
    this.token = d.token;
    this.name = d.name;
    this.id = d.id;
    this.email = d.email;
    this.rol = d.rol;
    this.createdAt = d.createAt;
  }
}
