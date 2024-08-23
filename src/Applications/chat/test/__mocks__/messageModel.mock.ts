import type { Message } from "../../domain";

interface MessageMock extends Message {
  id: string;
}

const mockMessagesDb: MessageMock[] = [];

const date = new Date();

export const mockMessageModel = {
  find: jest.fn().mockImplementation(() => {
    return {
      sort: jest.fn().mockImplementation(() => {
        return {
          lean: jest.fn().mockResolvedValue(mockMessagesDb),
        };
      }),
    };
  }),

  findByIdAndUpdate: jest.fn().mockImplementation(),

  create: jest.fn(async (msg: Message) => {
    const id = `000${mockMessagesDb.length + 1}`;
    const newMessage: MessageMock = {
      ...msg,
      id,
      attachments: [],
      createdAt: date,
      isTrashed: false,
    };
    mockMessagesDb.push(newMessage);
    return {
      save: jest.fn(async () => newMessage),
      ...newMessage,
    };
  }),
};
