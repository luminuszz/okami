import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { NotionApiAdapter } from './notion-api-adapter.provider';
import { NotionWorkRepository } from './notion-work.repository';
import { WorkMarkReadNotionEventHandler } from '@infra/database/notion/handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandler } from '@infra/database/notion/handlers/work-mark-unread';
import { WorkMarkedNotionFinishedEventHandler } from '@infra/database/notion/handlers/work-marked-finished';
import { WorkUpdatedEventHandler } from '@infra/database/notion/handlers/work-updated';
import {
  SetSyncIdOnNotionPageEventHandler,
  UploadNotionWorkImageFromNotionEventHandler,
} from '@infra/database/notion/handlers/work-created';
import { StorageModule } from '@infra/storage/storage.module';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';

@Module({
  imports: [CqrsModule, ConfigModule.forRoot(), StorageModule],
  providers: [
    NotionApiAdapter,
    NotionWorkRepository,
    WorkMarkReadNotionEventHandler,
    WorkMarkUnreadNotionEventHandler,
    WorkMarkedNotionFinishedEventHandler,
    WorkUpdatedEventHandler,
    SetSyncIdOnNotionPageEventHandler,
    UploadWorkImageUseCase,
    UploadNotionWorkImageFromNotionEventHandler,
  ],
  exports: [NotionWorkRepository, NotionApiAdapter],
})
export class NotionDatabaseModule {}
