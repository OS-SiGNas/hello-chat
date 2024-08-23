import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { User, UserMongooseModule } from "../../users/domain";

import { AuthService, JwtConfigModule, JwtStrategy } from "../applications";
import { LoginDto, PasswordMongooseModule, PasswordResetCache, RegisterDto, UserSessionDto } from "../domain";
import { mockUserModel } from "./__mocks__/userModel.mock";
import { mockUsersDb } from "./__mocks__/usersDb.mock";
import { mockPasswordResetModel } from "./__mocks__/passwordResetModel.mock";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserMongooseModule, PasswordMongooseModule, JwtConfigModule],
      providers: [AuthService, JwtStrategy],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken(PasswordResetCache.name))
      .useValue(mockPasswordResetModel)
      .overrideProvider(JwtStrategy)
      .useValue(jest.fn())
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should login user", async () => {
    const loginDto: LoginDto = { email: "signas13@gmail.com", password: "abc123" };
    expect(await service.login(loginDto)).toEqual<UserSessionDto>({
      id: expect.any(String),
      createdAt: expect.any(Date),
      email: loginDto.email,
      name: expect.any(String),
      rol: expect.any(String),
      token: expect.any(String),
    });
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
  });

  it("should register account", async () => {
    const registerDto: RegisterDto = { email: "test1@test.com", name: "test", password: "abc123" };
    const result = await service.register(registerDto);
    expect(result).toEqual(true);
    expect(mockUserModel.create).toHaveBeenCalledTimes(1);
  });

  it("should activate account", async () => {
    const token = mockUsersDb[mockUsersDb.length - 1].activationToken;
    expect(await service.activateAccount(token ?? "")).toEqual(true);
    expect(mockUserModel.findOne).toHaveBeenCalled();
  });

  it("should forgotPassword and changePassword", async () => {
    const email = "test1@test.com";
    const verificationString = await service.forgotPassword(email);
    expect(verificationString).toHaveLength(8);
    expect(mockPasswordResetModel.create).toHaveBeenCalled();
    if (verificationString !== null) {
      expect(await service.changePassword({ email, verificationString, newPassword: "aaa123" }));
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalled();
    }
  });
});
