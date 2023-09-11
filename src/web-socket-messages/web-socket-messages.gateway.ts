import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketMessagesService } from './web-socket-messages.service';
import { Socket } from 'socket.io';
import { NewMessage } from './dto/message-new.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class WebSocketMessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Socket;
  constructor(
    private readonly webSocketMessagesService: WebSocketMessagesService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.webSocketMessagesService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload });
    // this.webSocketMessagesService.registerClient(client, payload.id);
    // Emite el mensaje al cliente
    this.wss.emit(
      'clientes-updates',
      this.webSocketMessagesService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.webSocketMessagesService.removeClient(client.id);
    this.webSocketMessagesService.getConnectedClients();
  }

  //Recibir evento o mensaje del cliente
  @SubscribeMessage('mensaje-cliente')
  handleMessageCliente(cliente: Socket, payload: NewMessage) {
    // // !(Emite el unicamente al cliente y solo el lo puede ver)
    // cliente.emit('messages-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'No message',
    // });

    // Emite el mensaje a todos los clientes, expcepto al cliente que envia el mensaje(El cliente que emite el mensaje no ve el mensaje)
    // broadcast
    // cliente.broadcast.emit('messages-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'No message',
    // });

    // EMITE A TODOS LOS CLIENTES
    this.wss.emit('messages-from-server', {
      fullName: this.webSocketMessagesService.getFullNameUser(cliente.id),
      message: payload.message || 'No message',
    });
  }
}
