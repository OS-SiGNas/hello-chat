import { Logger, OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { validate } from "class-validator";

import { ChatService } from "../applications";
import { ChatMessageDto, NewChatDto, GetMessagesDto } from "../domain/";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  public readonly onModuleInit = (): void => {
    this.server.on("connection", async (socket: Socket) => {
      try {
        const token = socket.handshake?.auth?.token ?? socket.handshake?.headers?.token ?? "";
        const tokenInfo = await this.chatService.authClientFromToken(token);
        this.chatService.onClientConnected({ socketId: socket.id, userId: tokenInfo.id, rol: tokenInfo.rol });
        Logger.log(`Client ${tokenInfo.id} is connected `);

        socket.on("disconnect", () => {
          this.chatService.onClientDisconnected(tokenInfo.id);
          Logger.log(`Client ${tokenInfo.id} disconnected `);
        });
      } catch (error) {
        Logger.error(error);
        socket.disconnect();
      }
    });
  };

  @SubscribeMessage("new-chat")
  async newChat(@MessageBody() newChat: NewChatDto, @ConnectedSocket() socket: Socket): Promise<WsResponse> {
    try {
      const target = new NewChatDto(newChat);
      const validationError = await validate(target);
      if (validationError.length > 0) throw new WsException(String(validationError));
      Logger.log(`Request for new Chat from ${socket.id}`);
      const chatId = await this.chatService.createChat(newChat);
      Logger.log(`Chat ${chatId} is created`);
      // socket.join(chatId);
      this.server.to(chatId).emit("new-chat", chatId); // Notifica a los demás participantes
      return { event: "new-chat", data: chatId };
    } catch (error) {
      return { event: "new-chat", data: String(error) };
    }
  }

  @SubscribeMessage("chat-message")
  async handleMessage(@MessageBody() message: ChatMessageDto, @ConnectedSocket() socket: Socket): Promise<WsResponse> {
    try {
      const validationError = await validate(new ChatMessageDto(message));
      if (validationError.length > 0) throw new WsException(String(validationError));
      const newMessage = await this.chatService.createMessage(message);
      const socketReceiver = this.chatService.getSocketByUserId(message.receiver);
      if (socketReceiver !== null) socket.to(message.chatId).to(socketReceiver.socketId).emit("chat-message", newMessage);
      return { data: "success", event: "chat-message" };
    } catch (error) {
      return { data: error, event: "chat-message" };
    }
  }

  @SubscribeMessage("get-messages")
  async getMessages(@MessageBody() payload: GetMessagesDto): Promise<WsResponse> {
    try {
      const validationError = await validate(new GetMessagesDto(payload));
      if (validationError.length > 0) throw new WsException(String(validationError));
      const messages = await this.chatService.getUserMessagesFromChat(payload);
      return { event: "get-messages", data: messages };
    } catch (error) {
      Logger.error(error);
      return { event: "get-messages", data: error };
    }
  }
}
