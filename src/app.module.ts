import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@infra/http/http.module';
import { CommonExceptionInterceptor } from '@infra/interceptors/common-exception.interceptor';
import { LoggerModule } from '@infra/logs/logs.module';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EnvModule } from './infra/env/env.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    LoggerModule,
    EnvModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CommonExceptionInterceptor },
  ],
})
export class AppModule {}
