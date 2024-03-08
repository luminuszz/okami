import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { WorkNotFoundError } from './errors/work-not-found';
import { WorkRepository } from '../repositories/work-repository';
import { Work } from '@domain/work/enterprise/entities/work';

interface DeleteWorkRequest {
  workId: string;
}

type DeleteWorkResponse = Either<WorkNotFoundError, { work: Work }>;

@Injectable()
export class DeleteWork implements UseCaseImplementation<DeleteWorkRequest, DeleteWorkResponse> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ workId }: DeleteWorkRequest): Promise<DeleteWorkResponse> {
    const existsWork = await this.workRepository.findById(workId);

    if (!existsWork) return left(new WorkNotFoundError());

    await this.workRepository.deleteWork(workId);

    return right({
      work: existsWork,
    });
  }
}
