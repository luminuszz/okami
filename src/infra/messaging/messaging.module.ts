import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnvService } from '../env/env.service';
import { MessageService } from './messaging-service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.get('RABBIT_MQ_URL')],
            queue: 'notification-service-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [EnvService],
      },
    ]),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessagingModule {}
