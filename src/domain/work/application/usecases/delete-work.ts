import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

interface DeleteWorkRequest {
  workId: string;
  userId: string;
}

type DeleteWorkResponse = Either<WorkNotFoundError, { work: Work }>;

@Injectable()
export class DeleteWork implements UseCaseImplementation<DeleteWorkRequest, DeleteWorkResponse> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ workId, userId }: DeleteWorkRequest): Promise<DeleteWorkResponse> {
    const existsWork = await this.workRepository.findUserWorkById(userId, workId);

    if (!existsWork) return left(new WorkNotFoundError());

    await this.workRepository.deleteWork(workId);

    return right({
      work: existsWork,
    });
  }
}
