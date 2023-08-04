import { Injectable } from '@nestjs/common';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { CheckWithExistsNewChapterDto, FindSerieEpisodeDTO } from '@domain/work/application/queue/dto';

export enum QueueMessage {
  FIND_SERIE_EPISODE = 'find-serie-episode',
  FIND_COMIC_CAP_BY_URL = 'find-comic-cap-by-url',
  SYNC_WITH_OTHER_DATABASES = 'sync-with-other-databases',
}

@Injectable()
export class Queue {
  constructor(private readonly queueProvider: QueueProvider) {}

  async sendToRefreshWorkAnimeChapter(payload: FindSerieEpisodeDTO) {
    await this.queueProvider.publish(QueueMessage.FIND_SERIE_EPISODE, payload);
  }

  async sendToRefreshWorkMangaChapter(payload: CheckWithExistsNewChapterDto) {
    await this.queueProvider.publish(QueueMessage.FIND_COMIC_CAP_BY_URL, payload);
  }

  async syncWithOtherDatabases() {
    await this.queueProvider.publish(QueueMessage.SYNC_WITH_OTHER_DATABASES, {});
  }
}
