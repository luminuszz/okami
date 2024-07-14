import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { TagNotFoundException } from './errors/tag';
import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Injectable } from '@nestjs/common';

export interface DeleteTagRequest {
  tagId: string;
}

export type DeleteResponse = Either<TagNotFoundException, null>;

@Injectable()
export class DeleteTag implements UseCaseImplementation<DeleteTagRequest, DeleteResponse> {
  constructor(private tagRepository: TagRepository) {}

  async execute({ tagId }: DeleteTagRequest): Promise<DeleteResponse> {
    const tag = await this.tagRepository.findById(tagId);

    if (!tag) return left(new TagNotFoundException());

    await this.tagRepository.delete(tag.id);

    return right(null);
  }
}
