import { Either, left, right } from '@core/either';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

interface MarkWorkReadInput {
  id: string;
}

type MarkWorkReadOutput = Either<WorkNotFoundError, Work>;

@Injectable()
export class MarkWorkReadUseCase {
  constructor(private workRepository: WorkRepository) {}

  async execute({ id }: MarkWorkReadInput): Promise<MarkWorkReadOutput> {
    const work = await this.workRepository.findById(id);

    if (!work) {
      return left(new WorkNotFoundError());
    }

    work.markAsRead();

    work.updateNextChapter(null);

    await this.workRepository.save(work);

    return right(work);
  }
}
