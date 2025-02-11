import { CreateWorkUseCase } from '@domain/work/application/usecases/create-work'
import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read'
import { MarkWorkReadUseCase } from '@domain/work/application/usecases/mark-work-read'
import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread'
import { UpdateWorkChapterUseCase } from '@domain/work/application/usecases/update-work-chapter'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { Queue } from '@domain/work/application/queue/Queue'
import { CreateManySearchTokens } from '@domain/work/application/usecases/create-many-search-tokens'
import { CreateSearchToken } from '@domain/work/application/usecases/create-search-token'
import { CreateTag } from '@domain/work/application/usecases/create-tag'
import { DeleteSearchToken } from '@domain/work/application/usecases/delete-search-token'
import { DeleteTag } from '@domain/work/application/usecases/delete-tag'
import { DeleteWork } from '@domain/work/application/usecases/delete-work'
import { FetchAllTagsPaged } from '@domain/work/application/usecases/fetch-all-tags-paged'
import { FetchAllUserReadWorks } from '@domain/work/application/usecases/fetch-all-user-read-works'
import { FetchForWorkersUnreadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-unread'
import { FetchUserWorksWithFilterUseCase } from '@domain/work/application/usecases/fetch-user-works-with-filter'
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping'
import { FetchWorksScrapingPaginatedReportUseCase } from '@domain/work/application/usecases/fetch-works-scraping-pagineted-report'
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work'
import { GenerateWorkImageUploadUrlUseCase } from '@domain/work/application/usecases/generate-work-image-upload-url'
import { ListSearchTokensByType } from '@domain/work/application/usecases/list-search-tokens-by-type'
import { MarkWorkAsDroppedUseCase } from '@domain/work/application/usecases/mark-work-as-dropped'
import { MarkWorkFinishedUseCase } from '@domain/work/application/usecases/mark-work-finished'
import { MarkWorksOnPendingStatusUseCase } from '@domain/work/application/usecases/mark-works-on-pending-status'
import { RegisterNewWork } from '@domain/work/application/usecases/register-new-work'
import { RegisterScrappingStatus } from '@domain/work/application/usecases/register-scrapping-status'
import { ToggleWorkFavorite } from '@domain/work/application/usecases/toggle-work-favorite'
import { UpdateRefreshStatusUseCase } from '@domain/work/application/usecases/update-refresh-status'
import { UpdateTag } from '@domain/work/application/usecases/update-tag'
import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work'
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image'
import { commandHandlers } from '@infra/crqs/work/commands'
import { queryHandlers } from '@infra/crqs/work/queries'
import { QueueModule } from '@infra/queue/queue.module'
import { StorageModule } from '@infra/storage/storage.module'

const EventHandlers = []

@Module({
  imports: [CqrsModule, StorageModule, QueueModule],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
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
    GenerateWorkImageUploadUrlUseCase,
    RegisterScrappingStatus,
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
