import { Either, left, right } from '@core/either';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

interface MarkWorkUnreadInput {
  id: string;
  nextChapter?: number;
}

type MarkWorkUnreadOutput = Either<WorkNotFoundError, Work>;

@Injectable()
export class MarkWorkUnreadUseCase {
  constructor(private workRepository: WorkRepository) {}

  async execute({ id, nextChapter }: MarkWorkUnreadInput): Promise<MarkWorkUnreadOutput> {
    const work = await this.workRepository.findById(id);

    if (!work) {
      return left(new WorkNotFoundError());
    }

    work.markAsUnread(nextChapter);

    await this.workRepository.save(work);

    return right(work);
  }
}
