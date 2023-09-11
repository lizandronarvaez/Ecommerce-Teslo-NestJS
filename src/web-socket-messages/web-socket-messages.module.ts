import { Module } from '@nestjs/common';
import { WebSocketMessagesService } from './web-socket-messages.service';
import { WebSocketMessagesGateway } from './web-socket-messages.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [WebSocketMessagesGateway, WebSocketMessagesService],
  imports: [AuthModule],
})
export class WebSocketMessagesModule {}
