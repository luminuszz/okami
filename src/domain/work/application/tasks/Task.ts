import { Injectable } from '@nestjs/common';
import { ScheduleProvider } from '@domain/work/application/contracts/ScheduleProvider';
import { CronExpression } from '@nestjs/schedule';
import { FetchWorksForScrappingUseCase } from '@domain/work/application/usecases/fetch-works-for-scrapping';
import { Queue } from '@domain/work/application/queue/Queue';
import { Category } from '@domain/work/enterprise/entities/work';

@Injectable()
export class Task {
  constructor(
    private readonly scheduleProvider: ScheduleProvider,
    private readonly fetchWorksForScrappingUseCase: FetchWorksForScrappingUseCase,
    private readonly queue: Queue,
  ) {
    this.scheduleProvider.createTask(
      'refreshWorksStatus',
      CronExpression.EVERY_6_HOURS,
      this.createRefreshWorkChapterStatusTask.bind(this),
    );
  }

  public async createRefreshWorkChapterStatusTask() {
    const results = await this.fetchWorksForScrappingUseCase.execute();

    if (results.isRight()) {
      const { works } = results.value;

      for (const work of works) {
        if (work.category === Category.ANIME) {
          await this.queue.sendToRefreshWorkAnimeChapter({
            id: work.id,
            url: work.url,
            episode: work.chapter.getChapter(),
            name: work.name,
          });
        }

        if (work.category === Category.MANGA) {
          await this.queue.sendToRefreshWorkMangaChapter({
            name: work.name,
            url: work.url,
            cap: work.chapter.getChapter(),
            id: work.id,
          });
        }
      }
    }
  }
}
