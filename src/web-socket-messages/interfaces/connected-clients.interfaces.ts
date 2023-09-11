import { Socket } from 'socket.io';
import { Users } from 'src/auth/entities/users.entity';

export interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: Users;
  };
}
