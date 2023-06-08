import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from './infra/http/http.module';
import { LoggerModule } from './infra/logs/logs.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis: {
          port: config.get('REDIS_PORT'),
          host: config.get('REDIS_HOST'),
          password: config.get('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
