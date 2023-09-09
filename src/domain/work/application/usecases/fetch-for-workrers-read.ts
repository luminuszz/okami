import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';

type FetchForWorkersReadOutput = Either<void, { works: Work[] }>;

@Injectable()
export class FetchForWorkersReadUseCase implements UseCaseImplementation<void, FetchForWorkersReadOutput> {
  constructor(private workRepository: WorkRepository) {}

  async execute(): Promise<FetchForWorkersReadOutput> {
    const works = await this.workRepository.fetchForWorkersWithHasNewChapterFalse();

    return right({ works });
  }
}
