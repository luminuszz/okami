import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkMarkReadNotionEventHandler } from '@infra/crqs/notion/handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandler } from '@infra/crqs/notion/handlers/work-mark-unread';
import { WorkMarkedNotionFinishedEventHandler } from '@infra/crqs/notion/handlers/work-marked-finished';
import { WorkUpdatedEventHandler } from '@infra/crqs/notion/handlers/work-updated';
import { FailedNotionApiRetrySaga } from '@infra/crqs/notion/sagas/failed-notion-api-retry';
import { NotionDatabaseModule } from '@infra/database/notion/notion-database.module';

const EventHandlers = [
  WorkMarkReadNotionEventHandler,
  WorkMarkUnreadNotionEventHandler,
  WorkMarkedNotionFinishedEventHandler,
  WorkUpdatedEventHandler,
];

@Module({
  imports: [CqrsModule, NotionDatabaseModule],
  providers: [...EventHandlers, FailedNotionApiRetrySaga],
})
export class NotionModule {}
