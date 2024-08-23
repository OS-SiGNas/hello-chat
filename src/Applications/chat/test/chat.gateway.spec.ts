import { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { ChatGateway } from "../infrastructure";
import { ChatModule } from "../chat.module";
import { User } from "../../users/domain";
import { Chat, Message } from "../domain";

describe("ChatGateway", () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatModule],
      // providers: [ChatGateway, ChatService],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(jest.fn())
      .overrideProvider(getModelToken(Message.name))
      .useValue(jest.fn())
      .overrideProvider(getModelToken(Chat.name))
      .useValue(jest.fn())
      .compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
