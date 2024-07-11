import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repositories/tag-repository';
import { WorkRepository } from '../repositories/work-repository';
import { TagNotFoundException } from './errors/tag';
import { WorkNotFoundError } from './errors/work-not-found';

interface AddTagToWorkRequest {
  workId: string;
  tagId: string;
}

type AddTagToWorkResponse = Either<WorkNotFoundError | TagNotFoundException, void>;

@Injectable()
export class AddTagToWork implements UseCaseImplementation<AddTagToWorkRequest, AddTagToWorkResponse> {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly workRepository: WorkRepository,
  ) {}

  async execute({ tagId, workId }: AddTagToWorkRequest): Promise<AddTagToWorkResponse> {
    const tag = await this.tagRepository.findById(tagId);

    if (!tag) {
      return left(new TagNotFoundException());
    }

    const work = await this.workRepository.findById(workId);

    if (!work) {
      return left(new WorkNotFoundError());
    }

    await this.tagRepository.linkTagToWork(work.id, tag.id);

    return right(null);
  }
}
