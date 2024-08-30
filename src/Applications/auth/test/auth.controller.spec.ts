import { Test, TestingModule } from "@nestjs/testing";

import { AuthService } from "../applications";
import { AuthController } from "../infrastructure/auth.controller";
import { mockAuthService } from "./__mocks__/auth.service.mock";
import { LoginDto, RegisterDto, UserSessionDto } from "../domain";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should login user", async () => {
    const loginDto: LoginDto = { email: "signas13@gmail.com", password: "abc123" };

    expect(async () => await controller.login({ email: "", password: "" })).rejects.toThrow("email or password invalid");
    expect(async () => await controller.login({ email: loginDto.email, password: "121212" })).rejects.toThrow("email or password invalid");
    expect(await controller.login(loginDto)).toEqual<UserSessionDto>({
      id: expect.any(String),
      createdAt: expect.any(Date),
      email: loginDto.email,
      name: expect.any(String),
      roles: expect.any(Array),
      token: expect.any(String),
      chats: expect.any(Array),
      contacts: expect.any(Array),
    });

    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });

  it("should create user", async () => {
    const registerDto: RegisterDto = { email: "test@test.com", name: "tester", password: "1234567" };
    expect(await controller.register(registerDto)).toEqual("Created");
    expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
  });

  it("should activate account", async () => {
    const activateDto = { token: "activationToken123" };
    expect(await controller.activateAccount(activateDto)).toEqual("Account Activated");
    expect(mockAuthService.activateAccount).toHaveBeenCalledWith(activateDto.token);
  });

  it("should forgot password and change password", async () => {
    const email = "test@test.com";
    const verify = { verificationString: "verificationString12345" };
    expect(await controller.forgotPassword({ email })).toEqual(verify);
    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(email);

    const changePasswordDto = { email, newPassword: "121212", verificationString: verify.verificationString };
    expect(await controller.changePassword(changePasswordDto)).toEqual("Password updated");
    expect(mockAuthService.changePassword).toHaveBeenCalledWith(changePasswordDto);
  });
});
