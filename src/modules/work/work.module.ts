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
import { MarkWorkReadCommand } from './commands/mark-work-read.command';
import { MarkWorkUnreadCommand } from './commands/mark-work-unread.command';
import { WorkMarkUnreadEventHandler } from './events/work-mark-unread.event';
import { WorkJobsService } from './jobs/work-job.service';
import { WorkController } from './presentation/work.controller';
import { FetchForWorkersReadQueryHandler } from './queries/fetch-for-works-read.query';

const CommandHandlers = [
  CreateWorkHandler,
  MarkWorkReadCommand,
  MarkWorkUnreadCommand,
];

const QueryHandlers = [FetchForWorkersReadQueryHandler];

const EventHandlers = [WorkMarkUnreadEventHandler];

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
  controllers: [WorkController],
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
  ],
})
export class WorkModule {}
