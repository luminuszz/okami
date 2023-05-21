import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';

export class InMemoryWorkRepository implements WorkRepository {
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
}
