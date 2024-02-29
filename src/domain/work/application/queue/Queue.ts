import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import {
  CheckWithExistsNewChapterDto,
  FindSerieEpisodeDTO,
  RefreshWorkScrappingStatusDto,
  WorkNewChapterDto,
} from '@domain/work/application/queue/dto';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { Category, RefreshStatus, Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { FindOneWorkUseCase } from '../usecases/fnd-one-work';
import { MarkWorkUnreadUseCase } from '../usecases/mark-work-unread';
import { MarkWorksOnPendingStatusUseCase } from '../usecases/mark-works-on-pending-status';
import { UpdateRefreshStatusUseCase } from '../usecases/update-refresh-status';
import { FetchAllUserReadWorks } from '../usecases/fetch-all-user-read-works';

export enum QueueMessage {
  FIND_SERIE_EPISODE = 'find-serie-episode',
  FIND_COMIC_CAP_BY_URL = 'find-comic-cap-by-url',
  SYNC_WITH_OTHER_DATABASES = 'sync-with-other-databases',
  REFRESH_WORKS_STATUS = 'refresh-works-status',
  REFRESH_WORK_SCRAPPING_STATUS = 'refresh-work-scrapping-status',
  WORK_NEW_CHAPTER = 'work-new-chapter',
}

@Injectable()
export class Queue {
  constructor(
    private readonly queueProvider: QueueProvider,
    private readonly fetchForWorkScraping: FetchWorksForScrappingUseCase,
    private readonly markWorksOnPendingStatus: MarkWorksOnPendingStatusUseCase,
    private readonly updateRefreshStatus: UpdateRefreshStatusUseCase,
    private readonly findOneWork: FindOneWorkUseCase,
    private readonly markWorkUnread: MarkWorkUnreadUseCase,
    private readonly eventbus: EventBus,
    private readonly fetchAllReadUserWorks: FetchAllUserReadWorks,
  ) {
    this.queueProvider.subscribe(QueueMessage.REFRESH_WORKS_STATUS, () => this.refreshWorkStatus());
    this.queueProvider.subscribe(QueueMessage.REFRESH_WORK_SCRAPPING_STATUS, (payload: RefreshWorkScrappingStatusDto) =>
      this.refreshScrappingChapterStatus(payload),
    );
    this.queueProvider.subscribe(QueueMessage.WORK_NEW_CHAPTER, (payload: WorkNewChapterDto) =>
      this.workNewChapter(payload),
    );
  }

  async refreshWorkStatus() {
    const results = await this.fetchForWorkScraping.execute();

    if (results.isLeft()) {
      throw results.value;
    }

    const { works } = results.value;

    await this.markWorksOnPendingStatus.execute({ works });

    for (const work of works) {
      await this.sendWorkToSyncWorkQueue(work);
    }
  }

  async refreshWorkStatusOfOneWork(workId: string) {
    const workOrNullResults = await this.findOneWork.execute({ id: workId });

    if (workOrNullResults.isLeft()) {
      return;
    }

    const { work } = workOrNullResults.value;

    const response = await this.updateRefreshStatus.execute({
      workId: work.id,
      refreshStatus: RefreshStatus.PENDING,
    });

    if (response.isLeft()) {
      throw response.value;
    }

    await this.sendWorkToSyncWorkQueue(response.value);
  }

  async sendWorkToSyncWorkQueue(work: Work) {
    let payload: CheckWithExistsNewChapterDto | FindSerieEpisodeDTO;

    if (work.category === Category.ANIME) {
      payload = {
        episode: work.chapter.getChapter(),
        id: work.id,
        name: work.name,
        url: work.url,
      } satisfies FindSerieEpisodeDTO;

      await this.queueProvider.publish(QueueMessage.FIND_SERIE_EPISODE, payload);
    }

    if (work.category === Category.MANGA) {
      payload = {
        cap: work.chapter.getChapter(),
        id: work.id,
        name: work.name,
        url: work.url,
      } satisfies CheckWithExistsNewChapterDto;

      await this.queueProvider.publish(QueueMessage.FIND_COMIC_CAP_BY_URL, payload);
    }
  }

  async refreshScrappingChapterStatus(payload: RefreshWorkScrappingStatusDto) {
    await this.updateRefreshStatus.execute({
      refreshStatus: payload.status === 'success' ? RefreshStatus.SUCCESS : RefreshStatus.FAILED,
      workId: payload.workId,
    });
  }

  async workNewChapter({ nextChapter, workId }: WorkNewChapterDto) {
    const results = await this.markWorkUnread.execute({
      id: workId,
      nextChapter: nextChapter,
    });

    if (results.isLeft()) return;

    await this.eventbus.publishAll(results.value.events);
  }

  async refreshAllWorksStatusByUserId(userId: string) {
    const results = await this.fetchAllReadUserWorks.execute({ userId });

    if (results.isLeft()) {
      throw results.value;
    }

    const { works } = results.value;

    for (const work of works) {
      await this.sendWorkToSyncWorkQueue(work);
    }
  }
}
