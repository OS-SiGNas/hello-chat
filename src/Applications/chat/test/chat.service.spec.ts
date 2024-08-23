import { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getConnectionToken, getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

import { DatabaseModule } from "../../../Infrastructure/database.module";
import { JwtConfigModule } from "../../auth/applications";
import { User, UserMongooseModule } from "../../users/domain";

import { ChatService } from "../applications";
import { Chat, ChatMessageDto, ChatMongooseModule, Client, Message, MessageMongooseModule } from "../domain";
import { mockChatModel, mockConnection, mockMessageModel, mockUserModel } from "./__mocks__";

jest.mock("../domain/message.entity");

describe("ChatService", () => {
  let service: ChatService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UserMongooseModule, MessageMongooseModule, ChatMongooseModule, JwtConfigModule],
      providers: [ChatService],
    })

      .overrideProvider(getConnectionToken("Database"))
      .useValue(mockConnection)
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken(Message.name))
      .useValue(mockMessageModel)
      .overrideProvider(getModelToken(Chat.name))
      .useValue(mockChatModel)
      .compile();

    service = module.get<ChatService>(ChatService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("service should be defined", () => {
    expect(service).toBeDefined();
  });

  it("jwtService should be defined", () => {
    expect(jwtService).toBeDefined();
  });

  it("should authenticate and log in", async () => {
    const client: Client = { rol: "tester", userId: "000111", socketId: "111222" };
    const token = jwtService.sign({ id: client.userId, rol: client.rol });
    expect(await service.authClientFromToken(token)).toEqual({
      id: expect.any(String),
      rol: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
    void service.onClientConnected(client);
    expect(service.getSocketByUserId(client.userId)).toEqual(client);
  });

  it("should create a new chat with two users", async () => {
    const createChatPayload = { sender: "0001", receiver: "0002" };
    const result = await service.createChat(createChatPayload);
    expect(typeof result).toBe("string");
  });

  it("should create new message", async () => {
    const message1: ChatMessageDto = { chatId: "0001", sender: "0001", receiver: "0003", content: "hello" };
    const message2: ChatMessageDto = { chatId: "0001", sender: "0001", receiver: "0003", content: "world" };
    const message3: ChatMessageDto = { chatId: "0001", sender: "0001", receiver: "0003", content: "bye" };
    const expectMessage = {
      id: expect.any(String),
      chat: expect.any(String),
      sender: expect.any(String),
      receiver: expect.any(String),
      createdAt: expect.any(Date),
      isRead: expect.any(Boolean),
      isStarred: expect.any(Boolean),
      isTrashed: expect.any(Boolean),
      attachments: expect.any(Array),
      content: expect.any(String),
    };

    expect(await service.createMessage(message1)).toEqual(expectMessage);
    expect(await service.createMessage(message2)).toEqual(expectMessage);
    expect(await service.createMessage(message3)).toEqual(expectMessage);
  });

  it("should mark messages", async () => {
    expect(await service.markMessageAsRead("0001"));
    expect(await service.markMessageAsRead("0002"));
    expect(await service.markMessageAsRead("0003"));

    expect(await service.markMessageAsStarred("0002"));
    expect(await service.markMessageAsStarred("0003"));

    expect(mockMessageModel.findByIdAndUpdate).toHaveBeenCalledTimes(5);
  });

  it("should get messages by user from any chat", async () => {
    const messagesUser1 = await service.getUserMessagesFromChat({ chatId: "0001", userId: "0001" });
    const messagesUser2 = await service.getUserMessagesFromChat({ chatId: "0001", userId: "0002" });
    const expectMessages = { messages: expect.any(Array), cursor: expect.any(String) };

    expect(messagesUser1).toEqual(expectMessages);
    expect(messagesUser2).toEqual(expectMessages);
  });

  it.skip("should delete messages", async () => {
    expect(await service.deleteChatMessages({ chatId: "0001", messagesTarget: ["0001"], userId: "0001" }));
    expect(await service.deleteMessage("0002"));
  });
});
