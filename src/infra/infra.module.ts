import { Module } from '@nestjs/common';
import { WorkModule } from '@infra/crqs/work/work.module';
import { AuthModule } from '@infra/crqs/auth/auth.module';
import { NotionModule } from '@infra/crqs/notion/notion.module';
import { NotificationModule } from '@infra/crqs/notification/notification.module';
import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logs/logs.module';

@Module({
  imports: [WorkModule, AuthModule, NotionModule, NotificationModule, HttpModule, LoggerModule],
})
export class InfraModule {}
