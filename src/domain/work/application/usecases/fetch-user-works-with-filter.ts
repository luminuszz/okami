import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';

export type Status = 'unread' | 'read' | 'finished' | 'dropped';

interface FetchUserWorksInput {
  userId: string;
  status?: Status;
  search?: string;
}

type FetchUserWorksOutput = Either<void, { works: Work[] }>;

@Injectable()
export class FetchUserWorksWithFilterUseCase
  implements UseCaseImplementation<FetchUserWorksInput, FetchUserWorksOutput>
{
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ status, userId, search }: FetchUserWorksInput): Promise<FetchUserWorksOutput> {
    const works = await this.workRepository.fetchWorksByUserIdWithFilters({
      status,
      userId,
      search,
    });

    return right({
      works,
    });
  }
}
