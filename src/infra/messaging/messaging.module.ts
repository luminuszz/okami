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
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [env.get('KAFKA_BROKER')],
              ssl: true,
              sasl: {
                username: env.get('KAFKA_USER'),
                password: env.get('KAFKA_PASSWORD'),
                mechanism: 'scram-sha-256',
              },
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
