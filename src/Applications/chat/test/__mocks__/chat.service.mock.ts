/*
import { JwtPayload } from "src/Applications/auth/domain";
import {
  AddUserToChatArgs,
  ChatMessageDto,
  Client,
  DeleteChatMessagesArgs,
  GetUserMessagesFromChatArgs,
  IChatService,
  Message,
  NewChatDto,
} from "../../domain";

export const mockChatservice: IChatService = {
  onClientConnected: jest.fn((client: Client): void => {
    console.log(client);
    throw new Error("Function not implemented.");
  }),
  onClientDisconnected: jest.fn((clientId: string): boolean => {
    console.log(clientId);
    throw new Error("Function not implemented.");
  }),
  getSocketByUserId: jest.fn((userId: string): Client | null => {
    console.log(userId);
    throw new Error("Function not implemented.");
  }),
  authClientFromToken: jest.fn(async (token: string): Promise<JwtPayload> => {
    console.log(token);
    throw new Error("Function not implemented.");
  }),
  createChat: jest.fn(async (args: NewChatDto): Promise<string> => {
    console.log(args);
    throw new Error("Function not implemented.");
  }),
  createMessage: jest.fn(async (args: ChatMessageDto): Promise<Message> => {
    console.log(args);
    throw new Error("Function not implemented.");
  }),
  addUserToChat: jest.fn(async (args: AddUserToChatArgs): Promise<boolean> => {
    console.log(args);
    throw new Error("Function not implemented.");
  }),
  getUserMessagesFromChat: jest.fn(async (args: GetUserMessagesFromChatArgs): Promise<{ messages: Message[]; cursor: string | undefined }> => {
    console.log(args);
    throw new Error("Function not implemented.");
  }),
  markMessageAsRead: jest.fn(async (messageId: string): Promise<void> => {
    console.log(messageId);
    throw new Error("Function not implemented.");
  }),
  markMessageAsStarred: jest.fn(async (messageId: string): Promise<void> => {
    console.log(messageId);
    throw new Error("Function not implemented.");
  }),
  deleteMessage: jest.fn(async (messageId: string): Promise<void> => {
    console.log(messageId);
    throw new Error("Function not implemented.");
  }),
  deleteChatMessages: jest.fn(async (args: DeleteChatMessagesArgs): Promise<boolean> => {
    console.log(args);
    throw new Error("Function not implemented.");
  }),
};

*/
