import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import {
  SetSyncIdOnNotionPageEventHandler,
  UploadNotionWorkImageFromNotionEventHandler,
} from '@infra/database/notion/handlers/work-created';
import { WorkMarkReadNotionEventHandler } from '@infra/database/notion/handlers/work-mark-read';
import { WorkMarkUnreadNotionEventHandler } from '@infra/database/notion/handlers/work-mark-unread';
import { WorkMarkedNotionFinishedEventHandler } from '@infra/database/notion/handlers/work-marked-finished';
import { WorkUpdatedEventHandler } from '@infra/database/notion/handlers/work-updated';
import { StorageModule } from '@infra/storage/storage.module';
import { OnWorkDeletedHandler } from './handlers/on-work-deleted';
import { NotionWorkRepository } from './notion-work.repository';
import { NotionService } from './notion.service';

@Module({
  imports: [CqrsModule, ConfigModule.forRoot(), StorageModule],
  providers: [
    NotionService,
    NotionWorkRepository,
    WorkMarkReadNotionEventHandler,
    WorkMarkUnreadNotionEventHandler,
    WorkMarkedNotionFinishedEventHandler,
    WorkUpdatedEventHandler,
    SetSyncIdOnNotionPageEventHandler,
    UploadWorkImageUseCase,
    UploadNotionWorkImageFromNotionEventHandler,
    OnWorkDeletedHandler,
  ],
  exports: [NotionWorkRepository, NotionService],
})
export class NotionDatabaseModule {}
