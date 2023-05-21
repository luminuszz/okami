import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';
import { Category } from '@domain/work/enterprise/entities/work';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

interface FindSerieEpisodeDTO {
  id: string;
  url: string;
  episode: number;
  name: string;
}

interface CheckWithExistsNewChapterDto {
  id: string;
  url: string;
  cap: number;
  name: string;
}

@Injectable()
export class WorkJobsService {
  constructor(
    @InjectQueue('find-serie-episode')
    private readonly findSerieEpisodeQueue: Queue<FindSerieEpisodeDTO>,
    @InjectQueue('find-comic-cap-by-url')
    private readonly findChapterQueue: Queue<CheckWithExistsNewChapterDto>,

    private readonly fetchForWorkersReadUseCase: FetchForWorkersReadUseCase,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async triggerQueueFindSerieEpisodeQueue() {
    console.log('triggerQueueFindSerieEpisodeQueue');
    const { works } = await this.fetchForWorkersReadUseCase.execute({});

    works.forEach((work) => {
      if (work.category === Category.ANIME) {
        this.findSerieEpisodeQueue.add({
          id: work.id,
          url: work.url,
          episode: work.chapter.getChapter(),
          name: work.name,
        });
      }

      if (work.category === Category.MANGA) {
        this.findChapterQueue.add({
          id: work.id,
          url: work.url,
          cap: work.chapter.getChapter(),
          name: work.name,
        });
      }
    });
  }
}
