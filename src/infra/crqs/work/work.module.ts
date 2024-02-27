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

import { Queue } from '@domain/work/application/queue/Queue';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';
import { MarkWorkAsDroppedUseCase } from '@domain/work/application/usecases/mark-work-as-dropped';
import { MarkWorkFinishedUseCase } from '@domain/work/application/usecases/mark-work-finished';
import { UpdateRefreshStatusUseCase } from '@domain/work/application/usecases/update-refresh-status';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { MarkWorkFinishedCommandHandler } from '@infra/crqs/work/commands/mark-work-finished.command';
import { UpdateWorkRefreshStatusCommandHandler } from '@infra/crqs/work/commands/update-work-refresh-status.command';
import { UploadWorkImageCommandHandler } from '@infra/crqs/work/commands/upload-work-image.command';
import { QueueModule } from '@infra/queue/queue.module';
import { StorageModule } from '@infra/storage/storage.module';
import { MarkWorkAsDroppedCommandHandler } from './commands/mark-work-as-dropped.command';
import { FetchForWorkersReadQueryHandler } from './queries/fetch-for-works-read';
import { FetchForWorkersUnreadQueryHandler } from './queries/fetch-for-works-unread';
import { FindOneWorkQueryHandler } from './queries/find-one-work';
import { MarkWorksOnPendingStatusUseCase } from '@domain/work/application/usecases/mark-works-on-pending-status';
import { FetchWorksScrapingPaginatedReportQueryHandler } from './queries/fetch-for-works-scraping-report-paginated';
import { FetchWorksScrapingPaginatedReportUseCase } from '@domain/work/application/usecases/fetch-works-scraping-pagineted-report';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FetchUserWorksWithFilterUseCase } from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { FetchUserWorksWithFilterQueryHandler } from './queries/fetch-user-works-with-filter.query';
import { RegisterNewWork } from '@domain/work/application/usecases/register-new-work';

const CommandHandlers = [
  CreateWorkHandler,
  MarkWorkReadCommandHandler,
  MarkWorkUnreadCommandHandler,
  UpdateWorkChapterCommandHandler,
  UpdateWorkCommandHandler,
  MarkWorkFinishedCommandHandler,
  UploadWorkImageCommandHandler,
  UpdateWorkRefreshStatusCommandHandler,
  MarkWorkAsDroppedCommandHandler,
];

const QueryHandlers = [
  FetchForWorkersReadQueryHandler,
  FetchForWorkersUnreadQueryHandler,
  FindOneWorkQueryHandler,
  FetchWorksScrapingPaginatedReportQueryHandler,
  FetchUserWorksWithFilterQueryHandler,
];

const EventHandlers = [];

@Module({
  imports: [
    CqrsModule,
    StorageModule,
    QueueModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: 'notification-service-queue',
        },
      },
    ]),
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
    FetchForWorkersUnreadUseCase,
    UpdateWorkUseCase,
    FindOneWorkUseCase,
    MarkWorkFinishedUseCase,
    FetchWorksForScrappingUseCase,
    UploadWorkImageUseCase,
    UpdateRefreshStatusUseCase,
    MarkWorkAsDroppedUseCase,
    MarkWorksOnPendingStatusUseCase,
    FetchWorksScrapingPaginatedReportUseCase,
    FetchUserWorksWithFilterUseCase,
    RegisterNewWork,
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
    MarkWorksOnPendingStatusUseCase,
    RegisterNewWork,
  ],
})
export class WorkModule {}
