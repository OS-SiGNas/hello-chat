import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Request, UseGuards, UnauthorizedException } from "@nestjs/common";

import { JwtAuthGuard } from "../../auth/applications";
import type { UserRequest } from "../../auth/domain";

import { UsersService } from "../applications";
import { IUser, CreateUserDto, UpdateUserDto } from "../domain";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: UserRequest, @Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    if (req.user.rol !== "admin") throw new UnauthorizedException();
    console.log(req);
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: UserRequest): Promise<IUser[]> {
    if (req.user.rol !== "admin") throw new UnauthorizedException();
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req: UserRequest, @Param("id") id: string): Promise<IUser> {
    if (req.user.rol !== "admin") throw new UnauthorizedException();
    if (id.length !== 24) throw new HttpException(`user ${id} not found`, 404);
    const user = await this.usersService.findOne(id);
    if (user === null) throw new HttpException(`user ${id} not found`, 404);
    return user;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Request() req: UserRequest, @Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
    if (req.user.rol !== "admin") throw new UnauthorizedException();
    const result = await this.usersService.update(id, updateUserDto);
    if (result === false) throw new HttpException("Bad Request", 400);
    else return `Updated: ${id}`;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req: UserRequest, @Param("id") id: string): Promise<string> {
    if (req.user.rol !== "admin") throw new UnauthorizedException();
    const result = await this.usersService.remove(id);
    if (result === false) throw new HttpException("Bad Request", 400);
    return `Deleted: ${id}`;
  }
}
