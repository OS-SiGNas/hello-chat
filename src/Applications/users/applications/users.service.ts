import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Pagination } from "../../../Domain/";

import { encryptPassword } from "../../auth/applications";

import { User, IUser, CreateUserDto, UpdateUserDto } from "../domain";

@Injectable()
export class UsersService {
  readonly #logger = new Logger(this.constructor.name);
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  public readonly create = async (createUserDto: CreateUserDto): Promise<CreateUserDto> => {
    try {
      createUserDto.password = await encryptPassword(createUserDto.password);
      const newUser = await this.model.create({ ...createUserDto, createdAt: new Date(), isActive: true });
      return await newUser.save();
    } catch (error) {
      this.#logException(error);
      throw new InternalServerErrorException("Failed to create user; try latter");
    }
  };

  public readonly findAll = async (page: number): Promise<{ pagination: Pagination; users: IUser[] }> => {
    try {
      const limit = 2;
      const skip = (page - 1) * limit;
      const users = await this.model.find({}, { password: false, __v: false }).limit(limit).skip(skip).sort({ createdAt: -1 });
      const pagination: Pagination = { limit, previus: page === 1 ? undefined : page - 1, current: page, next: page + 1 };
      return { pagination, users };
    } catch (error) {
      this.#logException(error);
      throw new InternalServerErrorException("Error when trying to obtain users");
    }
  };

  public readonly findOne = async (id: string): Promise<IUser | null> => {
    try {
      return await this.model.findById(id, { password: false, __v: false });
    } catch (error) {
      this.#logException(error);
      throw new InternalServerErrorException("Error when trying to obtain user");
    }
  };

  public readonly update = async (id: string, updateUserDto: UpdateUserDto): Promise<boolean> => {
    try {
      const userUpdated = await this.model.findByIdAndUpdate(id, updateUserDto);
      if (userUpdated === null) return false;
      return true;
    } catch (error) {
      this.#logException(error);
      throw new InternalServerErrorException("Error when trying update user");
    }
  };

  public readonly remove = async (id: string): Promise<boolean> => {
    try {
      const userDeleted = await this.model.findByIdAndDelete(id);
      if (userDeleted === null) return false;
      else return true;
    } catch (error) {
      this.#logException(error);
      throw new InternalServerErrorException("Error when trying delete user");
    }
  };

  readonly #logException = (error: unknown | Error): void => {
    if (error instanceof Error) this.#logger.error(`[${error.constructor.name}][${error.name}]: ${error.message}\n\n${error.stack}`);
  };
}
