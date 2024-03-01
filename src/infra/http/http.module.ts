import { AuthModule } from '@infra/crqs/auth/auth.module';
import { NotificationModule } from '@infra/crqs/notification/notification.module';
import { DatabaseModule } from '@infra/database/database.module';
import { AuthController } from '@infra/http/controllers/auth.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkModule } from '../crqs/work/work.module';
import { MessagingModule } from '../messaging/messaging.module';
import { PaymentModule } from '../payment/payment.module';
import { NotificationController } from './controllers/notification.controller';
import { PaymentController } from './controllers/payment.controller';
import { WorkController } from './controllers/work.controller';

@Module({
  imports: [PaymentModule, CqrsModule, WorkModule, AuthModule, NotificationModule, DatabaseModule, MessagingModule],
  controllers: [WorkController, AuthController, NotificationController, PaymentController],
})
export class HttpModule {}
