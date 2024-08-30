import { Body, Controller, Get, HttpException, Param, Patch, Post } from "@nestjs/common";

import { ActivateAccountDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, UserSessionDto } from "../domain";
import { AuthService } from "../applications";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<UserSessionDto> {
    const user = await this.authService.login(loginDto);
    if (user === null) throw new HttpException("email or password invalid", 400);
    return user;
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto): Promise<string> {
    const user = await this.authService.register(registerDto);
    if (user === false) throw new HttpException("Something went wrong during registration, please try again later.", 500);
    return "Created";
  }

  @Get("activate-account/:token")
  async activateAccount(@Param() { token }: ActivateAccountDto): Promise<string> {
    const result = await this.authService.activateAccount(token);
    if (result === false) throw new HttpException("Bad Request", 400);
    return "Account Activated";
  }

  @Post("forgot-password")
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<object> {
    const verificationString = await this.authService.forgotPassword(email);
    if (verificationString === null) throw new HttpException(`User ${email} not found`, 404);
    return { verificationString }; // TODO: response only status code
  }

  @Patch("change-password")
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<string> {
    const result = await this.authService.changePassword(changePasswordDto);
    if (result === false) throw new HttpException("Bad Request", 400);
    else return "Password updated";
  }
}
