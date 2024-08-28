import { HttpException, Injectable, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";

import { ClientSession, Connection, FilterQuery, Model } from "mongoose";

import { PayloadToken } from "../../auth/domain";
import { User } from "../../users/domain";

import { Message, Chat, IChatService, AddUserToChat, Client, CreateChat, CreateMessage, DeleteChatMessages, GetUserMessagesFromChat } from "../domain";

@Injectable()
export class ChatService implements IChatService {
  readonly #logger = new Logger(ChatService.name);
  readonly #onlineSockets: Map<string, Client> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  public readonly onClientConnected = (client: Client): void => {
    this.#onlineSockets.set(client.userId, client);
    this.#logger.debug(`[OnClientConnected]: User ${client.userId} added to client map`);
  };

  public readonly onClientDisconnected = (clientId: string): boolean => {
    const result = this.#onlineSockets.delete(clientId);
    if (result) this.#logger.debug(`[OnClientDisconnected]: User ${clientId} removed to client map`);
    else this.#logger.warn(`[OnClientDisconnected]: User ${clientId} is not on the client map`);
    return result;
  };

  public readonly getSocketByUserId = (userId: string): Client | null => {
    const socket = this.#onlineSockets.get(userId);
    if (socket === undefined) this.#logger.warn(`[GetSocketByUserId]: User ${userId} is not on the client map`);
    return socket ?? null;
  };

  public readonly authClientFromToken = async (token: string): Promise<PayloadToken> => {
    if (token === undefined) throw new HttpException("Malformed auth request in socket", 400);
    const payload = await this.jwtService.verifyAsync<PayloadToken>(token);
    return payload;
  };

  public readonly createChat: CreateChat = async ({ sender, receiver }) => {
    const name = "[CreateChat]";
    let session: ClientSession | undefined;
    try {
      this.#logger.debug(name + ": Starting Session");
      session = await this.connection.startSession();
      session.startTransaction();
      this.#logger.debug(name + ": Transaction Started");

      const userSenderChats = await this.userModel.findById(sender, { chats: true });
      if (userSenderChats === null) throw new WsException(`User ${sender} not found`);
      const userReceiverChats = await this.userModel.findById(receiver, { chats: true });
      if (userReceiverChats === null) throw new WsException(`User ${receiver} not found`);
      this.#logger.debug(name + `: Participant for the new chat found: ${userSenderChats.id} and ${userReceiverChats.id}`);

      const chat = await this.chatModel.create({ isGroup: false, messagesByUser: new Map() });
      chat.messagesByUser.set(userSenderChats.id, []);
      chat.messagesByUser.set(userReceiverChats.id, []);

      const chatSaved = await chat.save();
      this.#logger.debug(name + `: New chat ${chatSaved.id} created`);

      userSenderChats.chats.push(chatSaved.id);
      userReceiverChats.chats.push(chatSaved.id);
      await userSenderChats.save();
      await userReceiverChats.save();
      this.#logger.debug(name + `: New chat ${chatSaved.id} pushed in users`);

      await session.commitTransaction();
      this.#logger.debug(name + ": Transaction commited");
      return chatSaved.id;
    } catch (error) {
      await session?.abortTransaction();
      const context = `Users: ${sender} and ${receiver}`;
      if (error instanceof Error) {
        this.#logger.error(name + `[${error.constructor.name}][${error.name}]: ${error.message} => ${context}`);
      }
      throw new WsException(`Something wrong when trying to create a new chat; ${context}`);
    } finally {
      await session?.endSession();
      this.#logger.debug(name + " Finally: Session finished");
    }
  };

  public readonly addUserToChat: AddUserToChat = async ({ chatId, userId }) => {
    const name = "[AddUserToChat]";
    let session: ClientSession | undefined;
    try {
      this.#logger.log(name + ": Starting Session");
      session = await this.connection.startSession();
      void session.startTransaction();
      this.#logger.log(name + ": Transaction Started");

      const user = this.userModel.exists({ _id: userId });
      if (user === null) throw new WsException(`User ${userId} not found`);

      const chat = await this.chatModel.findById(chatId);
      if (chat === null) throw new WsException(`Chat ${chatId} not found`);
      this.#logger.debug(name + `Chat ${chatId} and user ${userId} found`);

      chat.messagesByUser.set(userId, []);

      await session.commitTransaction();
      this.#logger.debug(name + " Transaction commited");
      await chat.save();
      return true;
    } catch (error) {
      await session?.abortTransaction();
      const context = `user ${userId} in chat ${chatId}; `;
      if (error instanceof Error) {
        this.#logger.error(name + `[${error.constructor.name}][${error.name}]: ${error.message} => ${context}`);
      }
      throw new WsException(`Something wrong when trying add ${context}`);
    } finally {
      await session?.endSession();
      this.#logger.debug(name + ": Session Finished");
    }
  };

  public readonly getUserMessagesFromChat: GetUserMessagesFromChat = async ({ chatId, userId, filter, cursor }) => {
    const name = "[GetUserMessagesFromChat]";
    let session: ClientSession | undefined;
    try {
      this.#logger.debug(name + ": Starting Session");
      session = await this.connection.startSession();
      session.startTransaction();
      this.#logger.debug(name + ": Transaction Started");

      const filterQuery: FilterQuery<Message> = { isTrashed: false };
      if (filter === "starred") filterQuery.isStarred = true;
      if (filter === "unread") filterQuery.isRead = false;

      const chat = await this.chatModel.findById(chatId, { messagesByUser: true });
      if (chat === null) throw new WsException(`Chat ${chatId} not found`);
      const messagesIds = chat.messagesByUser.get(userId);
      if (messagesIds === undefined) throw new WsException(`User ${userId} does not belong to the chat`);

      const pageSize = 5;
      let startIndex = cursor !== undefined ? messagesIds.indexOf(cursor) - pageSize : messagesIds.length - pageSize;
      if (startIndex < 0) startIndex = 0;
      const endIndex = cursor !== undefined ? messagesIds.indexOf(cursor) : messagesIds.length;
      const paginatedMessageIds = messagesIds.slice(startIndex, endIndex);
      const messages = await this.messageModel
        .find({ _id: { $in: paginatedMessageIds }, ...filterQuery })
        .sort({ createdAt: -1 })
        .lean();
      // const nextCursor = messages.length > 0 ? messages[messages.length - 1]._id.toString() : "";
      const nextCursor = paginatedMessageIds.length > 0 ? paginatedMessageIds[0] : "";

      await session.commitTransaction();
      this.#logger.debug(name + ": Transaction commited");
      return { messages, cursor: nextCursor };
    } catch (error) {
      await session?.abortTransaction();
      const context = `User ${userId} in chat ${chatId}`;
      this.#logger.warn(name + `: Transaction aborted`);
      if (error instanceof Error) {
        this.#logger.error(name + `[${error.constructor.name}][${error.name}]: ${error.message} => ${context}`);
      }
      throw new WsException(`Something wrong when trying to search for messages from ${context}`);
    } finally {
      await session?.endSession();
      this.#logger.debug(name + `: Session finished`);
    }
  };

  public readonly createMessage: CreateMessage = async ({ chatId, receiver, sender, content }) => {
    const name = "[CreateMessage]";
    let session: ClientSession | undefined;
    try {
      this.#logger.debug(name + ": Starting Session");
      session = await this.connection.startSession();
      session.startTransaction();
      this.#logger.debug(name + ": Transaction Started");

      const chat = await this.chatModel.findById(chatId, { messagesByUser: true });
      if (chat === null) throw new WsException(`Chat ${chatId} not found`);
      const newMessage = await this.messageModel.create({ chat: chat.id, sender, receiver, content, isRead: false, isStarred: false });
      const messageSaved = await newMessage.save();
      for (const messages of chat.messagesByUser.values()) messages.push(messageSaved.id);
      await chat.save();
      this.#logger.debug(name + `: ${chat.id} updated`);

      await session.commitTransaction();
      this.#logger.debug(name + ": Transaction commited");
      return messageSaved;
    } catch (error) {
      await session?.abortTransaction();
      const context = `Users: ${sender} and ${receiver}`;
      if (error instanceof Error) {
        this.#logger.error(name + `[${error.constructor.name}][${error.name}]: ${error.message} => ${context}`);
      }
      throw new WsException(`Something wrong when trying to create a new message; ${context}`);
    } finally {
      await session?.endSession();
      this.#logger.log(name + ": Session finished");
    }
  };

  public readonly markMessageAsRead = async (messageId: string): Promise<void> => {
    await this.messageModel.findByIdAndUpdate(messageId, { isRead: true });
  };

  public readonly markMessageAsStarred = async (messageId: string): Promise<void> => {
    await this.messageModel.findByIdAndUpdate(messageId, { isStarred: true });
  };

  public readonly deleteMessage = async (messageId: string): Promise<void> => {
    await this.messageModel.findByIdAndUpdate(messageId, { isTrashed: true });
  };

  public readonly deleteChatMessages: DeleteChatMessages = async ({ chatId, userId, messagesTarget }) => {
    const name = "[DeleteChatMessages]";
    try {
      const chat = await this.chatModel.findById(chatId, { messagesByUser: true });
      if (chat === null) throw new WsException(`Chat ${chatId} not found`);
      this.#logger.debug(name + `: Chat ${chatId} found`);
      const messages = chat.messagesByUser.get(userId);
      if (messages === undefined) throw new WsException(`User ${userId} does not belong to the chat`);
      const updatedMessages = messages.filter((message) => !messagesTarget.includes(message));
      chat.messagesByUser.set(userId, updatedMessages);
      this.#logger.debug(name + `: Chat ${chatId}, ${messagesTarget.length} messages deleted`);
      await chat.save();
      return true;
    } catch (error) {
      const context = `User ${userId} in Chat: ${chatId}`;
      if (error instanceof Error) {
        this.#logger.error(name + `[${error.constructor.name}][${error.name}]: ${error.message} => ${context}`);
      }
      throw new WsException(`Something wrong when trying to delete a message; ${context}`);
    }
  };
}

/*
  public readonly exec = async <T extends Methods>( action: Actions, args: Parameters<T>[0]): Promise<ReturnType<T>> => {
    let session: ClientSession | undefined;
    try {
      session = await this.connection.startSession();
      this.#logger.debug(`[${action}]: Session created`);
      session.startTransaction();
      this.#logger.debug(`[${action}]: Transaction started`);

      const service = this.#getMethodService(action);
      const result = await service(args as never)
      return result as ReturnType<T>

      session.commitTransaction();
      this.#logger.debug(`[${action}]: Transaction commited`);
      return result as R;
    } catch (error) {
      await session?.abortTransaction();
      this.#logger.warn(`[${action}]: Transaction aborted`);
      if (error instanceof Error) {
        this.#logger.error(`[${action}][${error.constructor.name}][${error.name}]: ${error.message}`. Context ${String(args)});
        throw new HttpException("Something wrong, try again latter", 500);
      } else throw error;
    } finally {
      await session?.endSession();
      this.#logger.debug(`[${action}] Session finished`);
    }
  };
*/
