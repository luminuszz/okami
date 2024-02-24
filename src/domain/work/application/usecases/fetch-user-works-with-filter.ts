import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';

export type Status = 'unread' | 'read' | 'finished' | 'dropped';

interface FetchUserWorksInput {
  userId: string;
  status?: Status;
}

type FetchUserWorksOutput = Either<void, { works: Work[] }>;

@Injectable()
export class FetchUserWorksWithFilterUseCase
  implements UseCaseImplementation<FetchUserWorksInput, FetchUserWorksOutput>
{
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ status, userId }: FetchUserWorksInput): Promise<FetchUserWorksOutput> {
    const works = await this.workRepository.fetchWorksByUserIdWithFilters({
      status,
      userId,
    });

    return right({
      works,
    });
  }
}
