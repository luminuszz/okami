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

import { Queue } from '@domain/work/application/queue/Queue';
import { CreateManySearchTokens } from '@domain/work/application/usecases/create-many-search-tokens';
import { CreateSearchToken } from '@domain/work/application/usecases/create-search-token';
import { CreateTag } from '@domain/work/application/usecases/create-tag';
import { DeleteSearchToken } from '@domain/work/application/usecases/delete-search-token';
import { DeleteTag } from '@domain/work/application/usecases/delete-tag';
import { DeleteWork } from '@domain/work/application/usecases/delete-work';
import { FetchAllTagsPaged } from '@domain/work/application/usecases/fetch-all-tags-paged';
import { FetchAllUserReadWorks } from '@domain/work/application/usecases/fetch-all-user-read-works';
import { FetchForWorkersUnreadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-unread';
import { FetchUserWorksWithFilterUseCase } from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { FetchWorksScrapingPaginatedReportUseCase } from '@domain/work/application/usecases/fetch-works-scraping-pagineted-report';
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';
import { ListSearchTokensByType } from '@domain/work/application/usecases/list-search-tokens-by-type';
import { MarkWorkAsDroppedUseCase } from '@domain/work/application/usecases/mark-work-as-dropped';
import { MarkWorkFinishedUseCase } from '@domain/work/application/usecases/mark-work-finished';
import { MarkWorksOnPendingStatusUseCase } from '@domain/work/application/usecases/mark-works-on-pending-status';
import { RegisterNewWork } from '@domain/work/application/usecases/register-new-work';
import { ToggleWorkFavorite } from '@domain/work/application/usecases/toggle-work-favorite';
import { UpdateRefreshStatusUseCase } from '@domain/work/application/usecases/update-refresh-status';
import { UpdateTag } from '@domain/work/application/usecases/update-tag';
import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { CreateSearchTokenCommandHandler } from '@infra/crqs/work/commands/create-search-token.command';
import { DeleteSearchTokenCommandHandler } from '@infra/crqs/work/commands/delete-search-token.command';
import { DeleteTagCommandHandler } from '@infra/crqs/work/commands/delete-tag.command';
import { MarkWorkFinishedCommandHandler } from '@infra/crqs/work/commands/mark-work-finished.command';
import { ToggleFavoriteCommandHandler } from '@infra/crqs/work/commands/toggle-favorite.command';
import { UpdateTagCommandHandler } from '@infra/crqs/work/commands/update-tag-command';
import { UpdateWorkRefreshStatusCommandHandler } from '@infra/crqs/work/commands/update-work-refresh-status.command';
import { UploadWorkImageCommandHandler } from '@infra/crqs/work/commands/upload-work-image.command';
import { FetchFavoritesWorksQueryHandler } from '@infra/crqs/work/queries/fetch-favorites-works';
import { FetchForSearchTokensByTypeQueryHandler } from '@infra/crqs/work/queries/fetch-for-search-tokens-by-type';
import { FilterTagBySearchQueryHandler } from '@infra/crqs/work/queries/filter-tag-by-search';
import { QueueModule } from '@infra/queue/queue.module';
import { StorageModule } from '@infra/storage/storage.module';
import { CreateManySearchTokensCommandHandler } from './commands/create-many-search-tokens.command';
import { CreateTagCommandHandler } from './commands/create-tag.command';
import { DeleteWorkCommandHandler } from './commands/delete-work.command';
import { MarkWorkAsDroppedCommandHandler } from './commands/mark-work-as-dropped.command';
import { UpdateWorkChapterCommandHandler } from './commands/update-work-chapter.command';
import { UpdateWorkCommandHandler } from './commands/update-work.command';
import { FetchForWorkersReadQueryHandler } from './queries/fetch-for-works-read';
import { FetchWorksScrapingPaginatedReportQueryHandler } from './queries/fetch-for-works-scraping-report-paginated';
import { FetchForWorkersUnreadQueryHandler } from './queries/fetch-for-works-unread';
import { FetchPagedTagsQueryHandler } from './queries/fetch-paged-tags';
import { FetchUserWorksWithFilterAndPagedQueryHandler } from './queries/fetch-user-works-with-filter-and-paged';
import { FetchUserWorksWithFilterQueryHandler } from './queries/fetch-user-works-with-filter.query';
import { FindOneWorkQueryHandler } from './queries/find-one-work';

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
  DeleteWorkCommandHandler,
  CreateTagCommandHandler,
  CreateSearchTokenCommandHandler,
  CreateManySearchTokensCommandHandler,
  DeleteSearchTokenCommandHandler,
  UpdateTagCommandHandler,
  DeleteTagCommandHandler,
  ToggleFavoriteCommandHandler,
];

const QueryHandlers = [
  FetchForWorkersReadQueryHandler,
  FetchForWorkersUnreadQueryHandler,
  FindOneWorkQueryHandler,
  FetchWorksScrapingPaginatedReportQueryHandler,
  FetchUserWorksWithFilterQueryHandler,
  FetchPagedTagsQueryHandler,
  FetchForSearchTokensByTypeQueryHandler,
  FilterTagBySearchQueryHandler,
  FetchFavoritesWorksQueryHandler,
  FetchUserWorksWithFilterAndPagedQueryHandler,
];

const EventHandlers = [];

@Module({
  imports: [CqrsModule, StorageModule, QueueModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    CreateTag,
    FetchAllTagsPaged,
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
    DeleteWork,
    FetchAllUserReadWorks,
    CreateSearchToken,
    CreateManySearchTokens,
    ListSearchTokensByType,
    DeleteSearchToken,
    UpdateTag,
    DeleteTag,
    Queue,
    ToggleWorkFavorite,
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
    FetchAllUserReadWorks,
  ],
})
export class WorkModule {}
