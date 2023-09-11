import { Injectable } from '@nestjs/common';
import { ConnectedClients } from './interfaces/connected-clients.interfaces';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Users } from 'src/auth/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WebSocketMessagesService {
  private connectedClient: ConnectedClients = {};

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');

    this.checkUserConnection(user);
    // Crea la conexion
    this.connectedClient[client.id] = {
      socket: client,
      user: user,
    };
  }

  removeClient(idClient: string) {
    delete this.connectedClient[idClient];
  }

  //   Mostrar el numero de clientes conectados
  getConnectedClients(): string[] {
    return Object.keys(this.connectedClient);
  }

  // MOstrar el nombre de usuario
  getFullNameUser(socketId: string) {
    return this.connectedClient[socketId].user.fullName;
  }

  // ELiminar duplicado de conexiones

  private checkUserConnection(user: Users) {
    for (const clienteID of Object.keys(this.connectedClient)) {
      const connectedClient = this.connectedClient[clienteID];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
