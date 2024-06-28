import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MessageService } from './messaging-service';
import { messageProviderConnectProvider } from '@infra/messaging/messaging-module.config';

@Module({
  imports: [ClientsModule.registerAsync([messageProviderConnectProvider])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessagingModule {}
