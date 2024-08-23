import { Chat } from "../../domain";

interface ChatMock extends Chat {
  id: string;
}

const mockChatsDb: ChatMock[] = [];

export const mockChatModel = {
  findById: jest.fn(async (id: string) => {
    const chat = mockChatsDb.find((chat) => chat.id === id);
    if (chat === undefined) return null;
    return {
      save: jest.fn(async () => chat),
      ...chat,
    };
  }),
  create: jest.fn(async (chatDto: Chat) => {
    const id = `000${mockChatsDb.length + 1}`;
    const newChat = { ...chatDto, id };
    mockChatsDb.push(newChat);
    return {
      save: jest.fn(async () => newChat),
      ...newChat,
    };
  }),
};
