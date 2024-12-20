import { NotificationModule } from '@infra/crqs/notification/notification.module';
import { DatabaseModule } from '@infra/database/database.module';
import { EnvModule } from '@infra/env/env.module';
import { HttpModule } from '@infra/http/http.module';
import { CommonExceptionInterceptor } from '@infra/interceptors/common-exception.interceptor';
import { LoggerModule } from '@infra/logs/logs.module';
import { SentryModule } from '@infra/logs/sentry/sentry.module';
import { PaymentModule } from '@infra/payment/payment.module';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    NotificationModule,
    SentryModule,
    PaymentModule,
    HttpModule,
    DatabaseModule,
    LoggerModule,
    EnvModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CommonExceptionInterceptor },
  ],
})
export class AppModule {}
