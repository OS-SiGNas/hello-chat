import type { PayloadToken } from "../../auth/domain";
import type { Rol } from "../../users/domain";

import type { NewChatDto } from "./dto/new-chat.dto";
import type { ChatMessageDto } from "./dto/chat-message.dto";
import type { Message } from "./message.entity";

export interface Client {
  userId: string;
  socketId: string;
  rol: Rol;
}

export type CreateChat = (args: NewChatDto) => Promise<string>;
export type CreateMessage = (args: ChatMessageDto) => Promise<Message>;

export type GetUserMessagesFromChat = (args: GetUserMessagesFromChatArgs) => Promise<{ messages: Message[]; cursor: string }>;
interface GetUserMessagesFromChatArgs {
  userId: string;
  chatId: string;
  filter?: "unread" | "starred";
  cursor?: string;
}

export type DeleteChatMessages = (args: DeleteChatMessagesArgs) => Promise<boolean>;
interface DeleteChatMessagesArgs {
  chatId: string;
  userId: string;
  messagesTarget: string[];
}

export type AddUserToChat = (args: AddUserToChatArgs) => Promise<boolean>;
interface AddUserToChatArgs {
  chatId: string;
  userId: string;
}

interface ChatService {
  onClientConnected: (client: Client) => void;
  onClientDisconnected: (clientId: string) => boolean;
  getSocketByUserId: (userId: string) => Client | null;
  authClientFromToken: (token: string) => Promise<PayloadToken>;
  createChat: CreateChat;
  createMessage: CreateMessage;
  addUserToChat: AddUserToChat;
  getUserMessagesFromChat: GetUserMessagesFromChat;
  markMessageAsRead: (messageId: string) => Promise<void>;
  markMessageAsStarred: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteChatMessages: DeleteChatMessages;
}

export type IChatService = Readonly<ChatService>;
