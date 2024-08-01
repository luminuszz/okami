import { Module } from '@nestjs/common';
import { MessageService } from './messaging-service';
import { ClientsModule } from '@nestjs/microservices';
import { messageProviderConnectProvider } from '@infra/messaging/messaging-module.config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const developBlockerMock = {
  subscribeToResponseOf: () => {},
  connect: () => {},
  emit: () => {},
  send: () => {},
};

@Module({
  imports: [ClientsModule.registerAsync([messageProviderConnectProvider])],
  providers: [MessageService /* { provide: 'NOTIFICATION_SERVICE', useValue: developBlockerMock }*/],
  exports: [MessageService],
})
export class MessagingModule {}
