import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards } from "@nestjs/common";

import { JwtAuthGuard, Protected, RolesGuard } from "../../auth/applications";

import { UsersService } from "../applications";
import { IUser, CreateUserDto, UpdateUserDto } from "../domain";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("all")
  @Protected("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Protected("standard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param("id") id: string): Promise<IUser> {
    if (id.length !== 24) throw new HttpException(`user ${id} not found`, 404);
    const user = await this.usersService.findOne(id);
    if (user === null) throw new HttpException(`user ${id} not found`, 404);
    return user;
  }

  @Post()
  @Protected("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Patch(":id")
  @Protected("standard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
    const result = await this.usersService.update(id, updateUserDto);
    if (result === false) throw new HttpException("Bad Request", 400);
    else return `Updated: ${id}`;
  }

  @Delete(":id")
  @Protected("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param("id") id: string): Promise<string> {
    const result = await this.usersService.remove(id);
    if (result === false) throw new HttpException("Bad Request", 400);
    return `Deleted: ${id}`;
  }
}
