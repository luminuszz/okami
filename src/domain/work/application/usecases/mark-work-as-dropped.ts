import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';
import { InvalidWorkOperationError } from './errors/invalid-work-operation';

interface MarkWorkAsDroppedInput {
  workId: string;
}

type MarkWorkAsDroppedOutput = Either<WorkNotFoundError | InvalidWorkOperationError, Work>;

@Injectable()
export class MarkWorkAsDroppedUseCase
  implements UseCaseImplementation<MarkWorkAsDroppedInput, MarkWorkAsDroppedOutput>
{
  constructor(private workRepository: WorkRepository) {}

  async execute({ workId }: MarkWorkAsDroppedInput): Promise<MarkWorkAsDroppedOutput> {
    const workOrNull = await this.workRepository.findById(workId);

    if (!workOrNull) {
      return left(new WorkNotFoundError());
    }

    if (workOrNull.isFinished) {
      return left(new InvalidWorkOperationError('work is finished'));
    }

    workOrNull.markAsDropped();

    await this.workRepository.save(workOrNull);

    return right(workOrNull);
  }
}
