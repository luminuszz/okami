import { Work } from '@domain/work/enterprise/entities/work';
import { WorkRepository } from '../repositories/work-repository';

interface FetchForWorkersReadOutput {
  works: Work[];
}

export class FetchForWorkersReadUseCase {
  constructor(private workRepository: WorkRepository) {}

  async execute(): Promise<FetchForWorkersReadOutput> {
    const works = await this.workRepository.fetchForWorkersWithHasNewChapterFalse();

    return {
      works,
    };
  }
}
