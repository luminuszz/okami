import { DatabaseModule } from '@app/infra/database/database.module';
import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';
import { MarkWorkReadUseCase } from '@domain/work/application/usecases/mark-work-read';
import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { UpdateWorkChapterUseCase } from '@domain/work/application/usecases/update-work-chapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateWorkHandler } from './commands/create-work.command';
import { MarkWorkReadCommandHandler } from './commands/mark-work-read.command';
import { MarkWorkUnreadCommandHandler } from './commands/mark-work-unread.command';

import { FetchForWorkersUnreadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-unread';
import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work';
import { UpdateWorkChapterCommandHandler } from './commands/update-work-chapter.command';
import { UpdateWorkCommandHandler } from './commands/update-work.command';
import { WorkJobsService } from './jobs/work-job.service';
import { FetchForWorkersReadQueryHandler } from './queries/fetch-for-works-read';
import { FetchForWorkersUnreadQueryHandler } from './queries/fetch-for-works-unread';

const CommandHandlers = [
  CreateWorkHandler,
  MarkWorkReadCommandHandler,
  MarkWorkUnreadCommandHandler,
  UpdateWorkChapterCommandHandler,
  UpdateWorkCommandHandler,
];

const QueryHandlers = [
  FetchForWorkersReadQueryHandler,
  FetchForWorkersUnreadQueryHandler,
];

const EventHandlers = [];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    BullModule.registerQueue(
      {
        name: 'find-serie-episode',
      },
      { name: 'find-comic-cap-by-url' },
    ),
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    CreateWorkUseCase,
    UpdateWorkChapterUseCase,
    MarkWorkReadUseCase,
    MarkWorkUnreadUseCase,
    FetchForWorkersReadUseCase,
    WorkJobsService,
    FetchForWorkersUnreadUseCase,
    UpdateWorkUseCase,
  ],
  exports: [
    CreateWorkUseCase,
    UpdateWorkChapterUseCase,
    MarkWorkReadUseCase,
    MarkWorkUnreadUseCase,
    FetchForWorkersReadUseCase,
    WorkJobsService,
    FetchForWorkersUnreadUseCase,
  ],
})
export class WorkModule {}
