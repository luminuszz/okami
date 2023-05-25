import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkMarkReadNotionEventHandler } from './handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandler } from './handlers/work-mark-unread';
import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionWorkRepository } from './notion-work.repository';

const EventHandlers = [
  WorkMarkUnreadNotionEventHandler,
  WorkMarkReadNotionEventHandler,
];

@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [...EventHandlers, NotionApiAdapter, NotionWorkRepository],
  exports: [NotionWorkRepository, NotionApiAdapter],
})
export class NotionModule {}
