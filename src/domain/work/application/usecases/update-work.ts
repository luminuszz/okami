import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';
import { WorkUpdatedEvent } from '@domain/work/enterprise/entities/events/work-updated';
import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { WatchList } from '@core/WatchList';
import { map } from 'lodash';

type UpdateWorkUseCaseInput = {
  id: string;
  userId: string;
  data: Partial<{
    chapter: number;
    url: string;
    name: string;
    tagsId: string[];
    alternativeName: string;
  }>;
};

type UpdateWorkUseCaseOutput = Either<WorkNotFoundError, { work: Work }>;

@Injectable()
export class UpdateWorkUseCase implements UseCaseImplementation<UpdateWorkUseCaseInput, UpdateWorkUseCaseOutput> {
  constructor(
    private readonly workRepository: WorkRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async execute({ data, id, userId }: UpdateWorkUseCaseInput): Promise<UpdateWorkUseCaseOutput> {
    const existsWork = await this.workRepository.findUserWorkById(userId, id);

    if (!existsWork) {
      return left(new WorkNotFoundError());
    }

    if (data.tagsId?.length) {
      const tags = await this.tagRepository.findAllTagsByWorkId(id);
      const list = new WatchList(map(tags, 'id'));

      const removedTags = list.getRemovedList(data?.tagsId ?? []);
      const addedTags = list.getAddedList(data?.tagsId ?? []);

      await this.tagRepository.updateTagList(id, addedTags, removedTags);
    }

    existsWork.updateChapter(data?.chapter ?? existsWork.chapter.getChapter());
    existsWork.url = data?.url ?? existsWork.url;
    existsWork.name = data?.name ?? existsWork.name;
    existsWork.tagsId = data?.tagsId ?? existsWork.tagsId;
    existsWork.alternativeName = data?.alternativeName ?? existsWork.alternativeName;

    await this.workRepository.save(existsWork);

    existsWork.events.push(new WorkUpdatedEvent(existsWork));

    return right({ work: existsWork });
  }
}
