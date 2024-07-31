import { Module } from '@nestjs/common';
import { MessageService } from './messaging-service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const developBlockerMock = {
  subscribeToResponseOf: () => {},
  connect: () => {},
  emit: () => {},
  send: () => {},
};

@Module({
  imports: [],
  providers: [MessageService, { provide: 'NOTIFICATION_SERVICE', useValue: developBlockerMock }],
  exports: [MessageService],
})
export class MessagingModule {}
