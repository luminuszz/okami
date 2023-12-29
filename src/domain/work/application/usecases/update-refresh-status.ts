import { UseCaseImplementation } from '@core/use-case';
import { RefreshStatus, Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@core/either';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';

interface UpdateRefreshStatusUseCasePayload {
  workId: string;
  refreshStatus: RefreshStatus;
}

type UpdateRefreshStatusUseCaseResult = Either<WorkNotFoundError, Work>;

@Injectable()
export class UpdateRefreshStatusUseCase
  implements UseCaseImplementation<UpdateRefreshStatusUseCasePayload, UpdateRefreshStatusUseCaseResult>
{
  constructor(private workRepository: WorkRepository) {}

  async execute({
    workId,
    refreshStatus,
  }: UpdateRefreshStatusUseCasePayload): Promise<UpdateRefreshStatusUseCaseResult> {
    const work = await this.workRepository.findById(workId);

    if (!work) {
      return left(new WorkNotFoundError());
    }

    work.refreshStatus = refreshStatus;

    await this.workRepository.save(work);

    return right(work);
  }
}
