import { UseCaseImplementation } from '@core/use-case';
import { WorkRepository } from '../repositories/work-repository';
import { RefreshStatus, Work } from '@domain/work/enterprise/entities/work';
import { Either, right } from '@core/either';
import { Injectable } from '@nestjs/common';

interface MarkWorksOnPendingStatusUseCaseProps {
  works: Work[];
}

type MarkWorksOnPendingStatusUseCaseResponse = Either<void, { works: Work[] }>;

@Injectable()
export class MarkWorksOnPendingStatusUseCase
  implements UseCaseImplementation<MarkWorksOnPendingStatusUseCaseProps, MarkWorksOnPendingStatusUseCaseResponse>
{
  constructor(private readonly workRepository: WorkRepository) {}
  async execute({ works }: MarkWorksOnPendingStatusUseCaseProps): Promise<MarkWorksOnPendingStatusUseCaseResponse> {
    works.forEach((work) => {
      work.refreshStatus = RefreshStatus.PENDING;
    });

    await this.workRepository.saveMany(works);

    return right({ works });
  }
}
