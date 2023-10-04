import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';

interface FetchForWorkersReadInput {
  userId: string;
}

type FetchForWorkersReadOutput = Either<void, { works: Work[] }>;

@Injectable()
export class FetchForWorkersReadUseCase
  implements UseCaseImplementation<FetchForWorkersReadInput, FetchForWorkersReadOutput>
{
  constructor(private workRepository: WorkRepository) {}

  async execute({ userId }: FetchForWorkersReadInput): Promise<FetchForWorkersReadOutput> {
    const works = await this.workRepository.fetchForWorkersWithHasNewChapterFalse(userId);

    return right({ works });
  }
}
