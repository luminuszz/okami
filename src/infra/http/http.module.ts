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
import { SearchTokenController } from '@infra/http/controllers/search-token.controller';

@Module({
  imports: [
    PaymentModule,
    CqrsModule,
    WorkModule,
    AuthModule,
    NotificationModule,
    DatabaseModule,
    MessagingModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
  controllers: [
    WorkController,
    AuthController,
    NotificationController,
    PaymentController,
    TagController,
    SearchTokenController,
  ],
})
export class HttpModule {}
