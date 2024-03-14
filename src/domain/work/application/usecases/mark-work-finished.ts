import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';

interface MarkWorkFinishedInput {
  workId: string;
  userId: string;
}

type MarkWorkFinishedOutput = Either<WorkNotFoundError, { work: Work }>;

@Injectable()
export class MarkWorkFinishedUseCase implements UseCaseImplementation<MarkWorkFinishedInput, MarkWorkFinishedOutput> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ workId, userId }: MarkWorkFinishedInput): Promise<MarkWorkFinishedOutput> {
    const workExists = await this.workRepository.findUserWorkById(userId, workId);

    if (!workExists) return left(new WorkNotFoundError());

    workExists.markAsFinished();

    await this.workRepository.save(workExists);

    return right({ work: workExists });
  }
}
