import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';

interface FetchForWorkersUnreadInput {}

interface FetchForWorkersUnreadOutput {
  works: Work[];
}

@Injectable()
export class FetchForWorkersUnreadUseCase {
  constructor(private workRepository: WorkRepository) {}

  async execute({}: FetchForWorkersUnreadInput): Promise<FetchForWorkersUnreadOutput> {
    const works =
      await this.workRepository.fetchForWorkersWithHasNewChapterTrue();

    return {
      works,
    };
  }
}
