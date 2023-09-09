import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';

type FetchForWorkersUnreadOutput = Either<void, { works: Work[] }>;

@Injectable()
export class FetchForWorkersUnreadUseCase implements UseCaseImplementation<void, FetchForWorkersUnreadOutput> {
  constructor(private workRepository: WorkRepository) {}

  async execute(): Promise<FetchForWorkersUnreadOutput> {
    const works = await this.workRepository.fetchForWorkersWithHasNewChapterTrue();

    return right({ works });
  }
}
