import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';
import { MarkWorkReadUseCase } from '@domain/work/application/usecases/mark-work-read';
import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { UpdateWorkChapterUseCase } from '@domain/work/application/usecases/update-work-chapter';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateWorkHandler } from './commands/create-work.command';
import { MarkWorkReadCommandHandler } from './commands/mark-work-read.command';
import { MarkWorkUnreadCommandHandler } from './commands/mark-work-unread.command';

import { FetchForWorkersUnreadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-unread';
import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work';
import { UpdateWorkChapterCommandHandler } from './commands/update-work-chapter.command';
import { UpdateWorkCommandHandler } from './commands/update-work.command';

import { FetchForWorkersReadQueryHandler } from './queries/fetch-for-works-read';
import { FetchForWorkersUnreadQueryHandler } from './queries/fetch-for-works-unread';
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';
import { FindOneWorkQueryHandler } from './queries/find-one-work';
import { MarkWorkFinishedCommandHandler } from '@infra/crqs/work/commands/mark-work-finished.command';
import { MarkWorkFinishedUseCase } from '@domain/work/application/usecases/mark-work-finished';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { UploadWorkImageCommandHandler } from '@infra/crqs/work/commands/upload-work-image.command';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { StorageModule } from '@infra/storage/storage.module';
import { QueueModule } from '@infra/queue/queue.module';
import { Queue } from '@domain/work/application/queue/Queue';
import { UpdateWorkRefreshStatusCommandHandler } from '@infra/crqs/work/commands/update-work-refresh-status.command';
import { UpdateRefreshStatusUseCase } from '@domain/work/application/usecases/update-refresh-status';

const CommandHandlers = [
  CreateWorkHandler,
  MarkWorkReadCommandHandler,
  MarkWorkUnreadCommandHandler,
  UpdateWorkChapterCommandHandler,
  UpdateWorkCommandHandler,
  MarkWorkFinishedCommandHandler,
  UploadWorkImageCommandHandler,
  UpdateWorkRefreshStatusCommandHandler,
];

const QueryHandlers = [FetchForWorkersReadQueryHandler, FetchForWorkersUnreadQueryHandler, FindOneWorkQueryHandler];

const EventHandlers = [];

@Module({
  imports: [CqrsModule, StorageModule, QueueModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    CreateWorkUseCase,
    UpdateWorkChapterUseCase,
    MarkWorkReadUseCase,
    MarkWorkUnreadUseCase,
    FetchForWorkersReadUseCase,
    FetchForWorkersUnreadUseCase,
    UpdateWorkUseCase,
    FindOneWorkUseCase,
    MarkWorkFinishedUseCase,
    FetchWorksForScrappingUseCase,
    UploadWorkImageUseCase,
    UpdateRefreshStatusUseCase,
    Queue,
  ],
  exports: [
    CreateWorkUseCase,
    UpdateWorkChapterUseCase,
    MarkWorkReadUseCase,
    MarkWorkUnreadUseCase,
    FetchForWorkersReadUseCase,
    FetchForWorkersUnreadUseCase,
    FindOneWorkUseCase,
    MarkWorkFinishedUseCase,
    FetchWorksForScrappingUseCase,
    UploadWorkImageUseCase,
    Queue,
  ],
})
export class WorkModule {}
