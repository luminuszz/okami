import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommonExceptionInterceptor } from '@infra/interceptors/common-exception.interceptor';
import loadSecrets from '@infra/utils/getSecretsEnv';
import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@infra/http/http.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [loadSecrets],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CommonExceptionInterceptor },
  ],
})
export class AppModule {}
