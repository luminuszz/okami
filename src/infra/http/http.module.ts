import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationModule } from '../crqs/notification/notification.module';
import { WorkModule } from '../crqs/work/work.module';
import { DatabaseModule } from '../database/database.module';
import { WorkController } from './work.controller';
import { AuthModule } from '@infra/crqs/auth/auth.module';
import { AuthController } from '@infra/http/auth.controller';

@Module({
  imports: [CqrsModule, WorkModule, NotificationModule, DatabaseModule, AuthModule],
  controllers: [WorkController, AuthController],
})
export class HttpModule {}
