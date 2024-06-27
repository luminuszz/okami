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
import { TagController } from './controllers/tag.controller';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from '../crqs/auth/role.guard';
import { AuthGuard } from '../crqs/auth/auth.guard';

@Module({
  imports: [PaymentModule, CqrsModule, WorkModule, AuthModule, NotificationModule, DatabaseModule, MessagingModule],
  providers: [
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  controllers: [WorkController, AuthController, NotificationController, PaymentController, TagController],
})
export class HttpModule {}
