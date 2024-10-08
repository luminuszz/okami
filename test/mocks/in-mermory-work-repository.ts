import { FetchUserWorksInput, WorkRepository } from '@domain/work/application/repositories/work-repository';
import { RefreshStatus, Work, WorkStatus } from '@domain/work/enterprise/entities/work';

export class InMemoryWorkRepository implements WorkRepository {
  async fetchForWorksForScrapping(): Promise<Work[]> {
    return this.works.filter(
      (item) =>
        (item.status === WorkStatus.READ && item.refreshStatus === RefreshStatus.FAILED) || RefreshStatus.SUCCESS,
    );
  }
  async fetchWorksByUserIdWithFilters(payload: FetchUserWorksInput): Promise<Work[]> {
    return this.works.filter((work) => work.userId === payload.userId);
  }
  public readonly works: Work[] = [];

  async create(work: Work): Promise<void> {
    this.works.push(work);
  }
  async save(work: Work): Promise<void> {
    const index = this.works.findIndex((w) => w.id === work.id);

    if (this.works[index]) {
      this.works[index] = work;
    }
  }

  async findById(id: string): Promise<Work> {
    return this.works.find((work) => work.id === id);
  }

  async fetchForWorkersWithHasNewChapterFalse(): Promise<Work[]> {
    return this.works.filter((work) => work.hasNewChapter === false);
  }

  async fetchForWorkersWithHasNewChapterTrue(): Promise<Work[]> {
    return this.works.filter((work) => work.hasNewChapter || work.isUnread);
  }

  async findOne(id: string): Promise<Work> {
    return this.works.find((work) => work.id === id);
  }

  async fetchForWorksWithHasNewChapterFalseAndWithIsFinishedFalseAndIsDroppedFalse(): Promise<Work[]> {
    return this.works
      .filter((item) => !item.isFinished)
      .filter((item) => !item.hasNewChapter)
      .filter((item) => !item.isDropped);
  }

  async saveMany(works: Work[]): Promise<void> {
    works.forEach((work) => {
      const index = this.works.findIndex((w) => w.id === work.id);

      if (this.works[index]) {
        this.works[index] = work;
      }
    });
  }

  async fetchWorksScrapingPaginated(userId: string, page: number): Promise<{ data: Work[]; totalOfPages: number }> {
    const limit = 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: this.works.slice(start, end).filter((work) => work.userId === userId),
      totalOfPages: Math.ceil(this.works.length / limit),
    };
  }

  async fetchAllWorksByUserIdCount(userId: string): Promise<number> {
    return this.works.filter((work) => work.userId === userId).length;
  }

  async deleteWork(workId: string): Promise<void> {
    this.works.splice(
      this.works.findIndex((work) => work.id === workId),
      1,
    );
  }

  async fetchAllWorksByUserIdAndHasNewChapterFalse(userId: string): Promise<Work[]> {
    return this.works.filter((work) => work.userId === userId && work.hasNewChapter === false);
  }

  async findUserWorkById(userId: string, workId: string): Promise<Work> {
    return this.works.find((work) => work.id === workId && work.userId === userId);
  }
}
