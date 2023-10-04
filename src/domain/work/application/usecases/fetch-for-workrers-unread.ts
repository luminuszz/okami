import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';

interface FetchForWorkersUnreadInput {
  userId: string;
}

type FetchForWorkersUnreadOutput = Either<void, { works: Work[] }>;

@Injectable()
export class FetchForWorkersUnreadUseCase
  implements UseCaseImplementation<FetchForWorkersUnreadInput, FetchForWorkersUnreadOutput>
{
  constructor(private workRepository: WorkRepository) {}

  async execute({ userId }: FetchForWorkersUnreadInput): Promise<FetchForWorkersUnreadOutput> {
    const works = await this.workRepository.fetchForWorkersWithHasNewChapterTrue(userId);

    return right({ works });
  }
}
