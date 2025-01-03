import { AuthModule } from '@infra/crqs/auth/auth.module';
import { NotificationModule } from '@infra/crqs/notification/notification.module';
import { DatabaseModule } from '@infra/database/database.module';
import { AuthController } from '@infra/http/controllers/auth.controller';
import { SearchTokenController } from '@infra/http/controllers/search-token.controller';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthGuard } from '../crqs/auth/auth.guard';
import { RoleGuard } from '../crqs/auth/role.guard';
import { WorkModule } from '../crqs/work/work.module';
import { PaymentModule } from '../payment/payment.module';

import { CalendarController } from '@app/infra/http/controllers/calendar.controller';
import { CalendarModule } from '@infra/crqs/calendar/calendar.module';
import { NotificationController } from './controllers/notification.controller';
import { PaymentController } from './controllers/payment.controller';
import { TagController } from './controllers/tag.controller';
import { WorkController } from './controllers/work.controller';

@Module({
  imports: [PaymentModule, CqrsModule, WorkModule, AuthModule, NotificationModule, DatabaseModule, CalendarModule],
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
    CalendarController,
  ],
})
export class HttpModule {}
