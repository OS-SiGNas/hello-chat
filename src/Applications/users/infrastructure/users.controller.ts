import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Put, Query, ParseIntPipe } from "@nestjs/common";

import { parseObjectId } from "../../../Domain";

import { JwtAuthGuard, Protected, RolesGuard } from "../../auth/applications";

import { UsersService } from "../applications";
import { IUser, CreateUserDto, UpdateUserDto } from "../domain";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("test/:str")
  @Protected("tester")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async test(@Param("str", parseObjectId) str: string): Promise<string> {
    return `el str: ${str}`;
  }

  @Get("all")
  @Protected("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query("page", ParseIntPipe) page: number): Promise<object> {
    return await this.usersService.findAll(page);
  }

  @Get(":id")
  @Protected("standard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param("id", parseObjectId) id: string): Promise<IUser> {
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
  async patch(@Param("id", parseObjectId) id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
    const result = await this.usersService.update(id, updateUserDto);
    if (result === false) throw new HttpException("Bad Request", 400);
    else return `Updated: ${id}`;
  }

  @Put(":id")
  @Protected("standard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param("id", parseObjectId) id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
    const result = await this.usersService.update(id, updateUserDto);
    if (result === false) throw new HttpException("Bad Request", 400);
    else return `Updated: ${id}`;
  }

  @Delete(":id")
  @Protected("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param("id", parseObjectId) id: string): Promise<string> {
    const result = await this.usersService.remove(id);
    if (result === false) throw new HttpException("Bad Request", 400);
    return `Deleted: ${id}`;
  }
}
