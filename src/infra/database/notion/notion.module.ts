import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkMarkReadNotionEventHandler } from './handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandler } from './handlers/work-mark-unread';
import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionWorkRepository } from './notion-work.repository';
import { WorkMarkedNotionFinishedEventHandler } from '@infra/database/notion/handlers/work-marked-finished';

const EventHandlers = [
  WorkMarkedNotionFinishedEventHandler,
  WorkMarkUnreadNotionEventHandler,
  WorkMarkReadNotionEventHandler,
];

@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [...EventHandlers, NotionApiAdapter, NotionWorkRepository],
  exports: [NotionWorkRepository, NotionApiAdapter],
})
export class NotionModule {}
