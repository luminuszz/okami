import { Category, Work } from '@domain/work/enterprise/entities/work';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { JobId } from '@infra/crqs/work/jobs/JobId';

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

    private readonly fetchWorksForScrappingUseCase: FetchWorksForScrappingUseCase,
  ) {}

  private async addFindSerieEpisodeQueue(work: Work) {
    const jobId = JobId.getJobId(work.id, work.chapter.getChapter());

    const job = await this.findSerieEpisodeQueue.getJob(jobId);

    if (!job) {
      await this.findSerieEpisodeQueue.add(
        {
          id: work.id,
          url: work.url,
          episode: work.chapter.getChapter(),
          name: work.name,
        },
        { removeOnComplete: true, jobId },
      );
    }
  }

  private async addFindChapterQueue(work: Work) {
    const jobId = JobId.getJobId(work.id, work.chapter.getChapter());

    const job = await this.findChapterQueue.getJob(jobId);

    if (!job) {
      await this.findChapterQueue.add(
        {
          id: work.id,
          url: work.url,
          cap: work.chapter.getChapter(),
          name: work.name,
        },
        { removeOnComplete: true, jobId },
      );
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS, { name: 'fetch-works-for-scrapping' })
  async triggerQueueFindSerieEpisodeQueue() {
    const { value } = await this.fetchWorksForScrappingUseCase.execute();

    for (const work of value.works) {
      if (work.category === Category.ANIME) {
        await this.addFindSerieEpisodeQueue(work);
      }

      if (work.category === Category.MANGA) {
        await this.addFindChapterQueue(work);
      }
    }
  }
}
