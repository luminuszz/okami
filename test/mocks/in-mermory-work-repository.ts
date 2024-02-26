import { FetchUserWorksInput, WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';

export class InMemoryWorkRepository implements WorkRepository {
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
    return this.works.filter((work) => work.hasNewChapter);
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

  async fetchWorksScrapingPaginated(page: number): Promise<{ data: Work[]; totalOfPages: number }> {
    const limit = 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: this.works.slice(start, end),
      totalOfPages: Math.ceil(this.works.length / limit),
    };
  }
}
