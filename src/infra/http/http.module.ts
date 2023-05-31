import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationModule } from '../crqs/notification/notification.module';
import { WorkModule } from '../crqs/work/work.module';
import { DatabaseModule } from '../database/database.module';
import { WorkController } from './work.controller';

@Module({
  imports: [CqrsModule, WorkModule, NotificationModule, DatabaseModule],
  controllers: [WorkController],
})
export class HttpModule {}
