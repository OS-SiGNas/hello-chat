import { randomBytes } from "crypto";
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";

import { User } from "../../users/domain";

import { comparePassword, encryptPassword } from "./password.handler";
import { ChangePasswordDto, LoginDto, PasswordResetCache, RegisterDto, UserSessionDto } from "../domain";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(PasswordResetCache.name) private readonly passwordResetModel: Model<PasswordResetCache>,
    private readonly jwtService: JwtService,
  ) {}

  public readonly login = async ({ email, password }: LoginDto): Promise<UserSessionDto | null> => {
    const user = await this.userModel.findOne({ email });
    if (user === null) return null;
    if (user.isActive === false) throw new HttpException("Inactive Account", 403);
    const isMatch = await comparePassword(password, user.password);
    if (isMatch === false) return null;

    return new UserSessionDto({
      token: this.jwtService.sign({ id: user.id, rol: user.rol }),
      id: user.id,
      name: user.name,
      email: user.email,
      rol: user.rol,
      createAt: user.createdAt,
    });
  };

  public readonly register = async (register: RegisterDto): Promise<boolean> => {
    const createdAt = new Date();
    const activationToken = this.jwtService.sign({ email: register.email, createdAt });
    const newUser = await this.userModel.create({
      email: register.email,
      name: register.name,
      password: await encryptPassword(register.password),
      rol: "standard",
      createdAt,
      isActive: false,
      activationToken,
    });
    // await this.notificationService.sendEmailActivateAccount({email: register.email, activationToken  })
    if (newUser === undefined) return false;
    return true;
  };

  public readonly activateAccount = async (token: string): Promise<boolean> => {
    const { email } = this.jwtService.verify<{ email: string }>(token);
    const user = await this.userModel.findOne({ email });
    if (user === null) return false;
    if (user.activationToken !== token) return false;
    user.isActive = true;
    user.activationToken = undefined;
    await user.save();
    return true;
  };

  public readonly forgotPassword = async (email: string): Promise<string | null> => {
    const user = await this.userModel.findOne({ email });
    if (user === null) return null;
    const verificationString = randomBytes(4).toString("hex");
    const passwordResetDocument = await this.passwordResetModel.create({
      verificationString: await encryptPassword(verificationString),
      email: user.email,
      createdAt: new Date(),
    });

    await passwordResetDocument.save();
    // await this.notificationService.sendEmailWithChangePassword({email, verificationString})
    return verificationString;
  };

  public readonly changePassword = async ({ email, newPassword, verificationString }: ChangePasswordDto): Promise<boolean> => {
    const verificationEntity = await this.passwordResetModel.findOne({ email });
    if (verificationEntity === null) return false;
    const isMatch = await comparePassword(verificationString, verificationEntity.verificationString);
    if (isMatch === false) return false;
    const user = await this.userModel.findOneAndUpdate({ email }, { password: await encryptPassword(newPassword) });
    if (user === null) return false;
    return true;
  };
}
