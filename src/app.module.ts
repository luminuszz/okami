import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommonExceptionInterceptor } from '@infra/interceptors/common-exception.interceptor';
import loadSecrets from '@infra/utils/getSecretsEnv';
import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logs/logs.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({
      load: [loadSecrets],
      isGlobal: true,
    }),
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
