import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkModule } from '../crqs/work/work.module';
import { WorkController } from './controllers/work.controller';
import { AuthModule } from '@infra/crqs/auth/auth.module';
import { AuthController } from '@infra/http/controllers/auth.controller';
import { NotificationModule } from '@infra/crqs/notification/notification.module';
import { DatabaseModule } from '@infra/database/database.module';
import { NotificationController } from './controllers/notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CqrsModule,
    WorkModule,
    AuthModule,
    NotificationModule,
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: 'notification_service_queue',
        },
      },
    ]),
  ],
  controllers: [WorkController, AuthController, NotificationController],
})
export class HttpModule {}
