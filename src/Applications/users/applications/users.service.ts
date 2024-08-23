import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { encryptPassword } from "../../auth/applications";

import { User, IUser, CreateUserDto, UpdateUserDto } from "../domain";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  public readonly create = async (createUserDto: CreateUserDto): Promise<CreateUserDto> => {
    const newUser = await this.model.create({
      ...createUserDto,
      password: await encryptPassword(createUserDto.password),
      createdAt: new Date(),
      isActive: true,
    });
    return await newUser.save();
  };

  public readonly findAll = async (): Promise<IUser[]> => {
    return await this.model.find();
  };

  public readonly findOne = async (id: string): Promise<IUser | null> => {
    const user = await this.model.findById(id);
    return user;
  };

  public readonly update = async (id: string, updateUserDto: UpdateUserDto): Promise<boolean> => {
    const userUpdated = await this.model.findByIdAndUpdate({ id }, { ...updateUserDto });
    if (userUpdated === null) return false;
    return true;
  };

  public readonly remove = async (id: string): Promise<boolean> => {
    const userDeleted = await this.model.deleteOne({ id });
    if (userDeleted !== undefined) return false;
    else return true;
  };
}
