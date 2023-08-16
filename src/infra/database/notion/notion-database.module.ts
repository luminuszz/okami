import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionWorkRepository } from './notion-work.repository';
import { WorkMarkReadNotionEventHandler } from '@infra/database/notion/handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandler } from '@infra/database/notion/handlers/work-mark-unread';
import { WorkMarkedNotionFinishedEventHandler } from '@infra/database/notion/handlers/work-marked-finished';
import { WorkUpdatedEventHandler } from '@infra/database/notion/handlers/work-updated';
import { FailedNotionApiRetrySaga } from '@infra/database/notion/sagas/failed-notion-api-retry';

@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  providers: [
    NotionApiAdapter,
    NotionWorkRepository,
    WorkMarkReadNotionEventHandler,
    WorkMarkUnreadNotionEventHandler,
    WorkMarkedNotionFinishedEventHandler,
    WorkUpdatedEventHandler,
    FailedNotionApiRetrySaga,
  ],
  exports: [NotionWorkRepository, NotionApiAdapter],
})
export class NotionDatabaseModule {}
