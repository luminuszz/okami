import { Injectable } from '@nestjs/common';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import {
  CheckWithExistsNewChapterDto,
  FindSerieEpisodeDTO,
  RefreshWorkScrappingStatusDto,
} from '@domain/work/application/queue/dto';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { Category, RefreshStatus } from '@domain/work/enterprise/entities/work';
import { MarkWorksOnPendingStatusUseCase } from '../usecases/mark-works-on-pending-status';
import { UpdateRefreshStatusUseCase } from '../usecases/update-refresh-status';

export enum QueueMessage {
  FIND_SERIE_EPISODE = 'find-serie-episode',
  FIND_COMIC_CAP_BY_URL = 'find-comic-cap-by-url',
  SYNC_WITH_OTHER_DATABASES = 'sync-with-other-databases',
  REFRESH_WORKS_STATUS = 'refresh-works-status',
  REFRESH_WORK_SCRAPPING_STATUS = 'refresh-work-scrapping-status',
}

@Injectable()
export class Queue {
  constructor(
    private readonly queueProvider: QueueProvider,
    private readonly fetchForWorkScraping: FetchWorksForScrappingUseCase,
    private readonly markWorksOnPendingStatus: MarkWorksOnPendingStatusUseCase,
    private readonly updateRefreshStatus: UpdateRefreshStatusUseCase,
  ) {
    this.queueProvider.subscribe(QueueMessage.REFRESH_WORKS_STATUS, () => this.refreshWorkStatus());
    this.queueProvider.subscribe(QueueMessage.REFRESH_WORK_SCRAPPING_STATUS, (payload: RefreshWorkScrappingStatusDto) =>
      this.refreshScrappingChapterStatus(payload),
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
      if (work.category === Category.ANIME) {
        await this.sendToRefreshWorkAnimeChapter({
          id: work.id,
          url: work.url,
          name: work.name,
          episode: work.chapter.getChapter(),
        });
      }

      if (work.category === Category.MANGA) {
        await this.sendToRefreshWorkMangaChapter({
          id: work.id,
          url: work.url,
          name: work.name,
          cap: work.chapter.getChapter(),
        });
      }
    }
  }

  async sendToRefreshWorkAnimeChapter(payload: FindSerieEpisodeDTO) {
    await this.queueProvider.publish(QueueMessage.FIND_SERIE_EPISODE, payload);
  }

  async sendToRefreshWorkMangaChapter(payload: CheckWithExistsNewChapterDto) {
    await this.queueProvider.publish(QueueMessage.FIND_COMIC_CAP_BY_URL, payload);
  }

  async refreshScrappingChapterStatus(payload: RefreshWorkScrappingStatusDto) {
    await this.updateRefreshStatus.execute({
      refreshStatus: payload.status === 'success' ? RefreshStatus.SUCCESS : RefreshStatus.FAILED,
      workId: payload.workId,
    });
  }
}
