import { Module } from '@nestjs/common';
import { WorkModule } from '@infra/crqs/work/work.module';
import { AuthModule } from '@infra/crqs/auth/auth.module';
import { NotificationModule } from '@infra/crqs/notification/notification.module';
import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logs/logs.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, WorkModule, AuthModule, NotificationModule, HttpModule, LoggerModule],
})
export class InfraModule {}
