import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';
import { WorkUpdatedEvent } from '@domain/work/enterprise/entities/events/work-updated';

type UpdateWorkUseCaseInput = {
  id: string;
  userId: string;
  data: Partial<{
    chapter: number;
    url: string;
    name: string;
  }>;
};

type UpdateWorkUseCaseOutput = Either<WorkNotFoundError, { work: Work }>;

@Injectable()
export class UpdateWorkUseCase implements UseCaseImplementation<UpdateWorkUseCaseInput, UpdateWorkUseCaseOutput> {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute({ data, id, userId }: UpdateWorkUseCaseInput): Promise<UpdateWorkUseCaseOutput> {
    const existsWork = await this.workRepository.findUserWorkById(userId, id);

    if (!existsWork) {
      return left(new WorkNotFoundError());
    }

    existsWork.updateChapter(data?.chapter ?? existsWork.chapter.getChapter());
    existsWork.url = data?.url ?? existsWork.url;
    existsWork.name = data?.name ?? existsWork.name;

    await this.workRepository.save(existsWork);

    existsWork.events.push(new WorkUpdatedEvent(existsWork));

    return right({ work: existsWork });
  }
}
