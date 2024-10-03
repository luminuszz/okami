import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';
import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { InvalidWorkOperationError } from '@domain/work/application/usecases/errors/invalid-work-operation';

interface UpdateWorkChapterInput {
  id: string;
  chapter: number;
  userId: string;
}

type UpdateWorkChapterOutput = Either<WorkNotFoundError | InvalidWorkOperationError, { work: Work }>;

@Injectable()
export class UpdateWorkChapterUseCase
  implements UseCaseImplementation<UpdateWorkChapterInput, UpdateWorkChapterOutput>
{
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ chapter, id, userId }: UpdateWorkChapterInput): Promise<UpdateWorkChapterOutput> {
    const work = await this.workRepository.findUserWorkById(userId, id);

    if (!work) {
      left(new WorkNotFoundError());
    }

    const canMarkWorkAsRead = !work.isFinished && !work.isDropped;

    if (!canMarkWorkAsRead) {
      return left(new InvalidWorkOperationError('Work cannot be marked as read'));
    }

    const currentWorkChapter = work.chapter.getChapter();

    work.updateChapter(chapter);

    if (chapter >= currentWorkChapter) {
      work.markAsRead();
    }

    await this.workRepository.save(work);

    return right({
      work,
    });
  }
}
