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
          transport: Transport.REDIS,
          options: {
            url: env.get('REDIS_HOST'),
            port: env.get('REDIS_PORT'),
            username: env.get('REDIS_USER'),
            password: env.get('REDIS_PASSWORD'),
            host: env.get('REDIS_HOST'),
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
