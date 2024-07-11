import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { TagAlreadyExistsException, TagNotFoundException } from '@domain/work/application/usecases/errors/tag';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Injectable } from '@nestjs/common';
import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';

export interface UpdateTagRequest {
  id: string;
  name?: string;
  color?: string;
}

type UpdateTagResponse = Either<TagAlreadyExistsException | TagNotFoundException, { tag: Tag }>;

@Injectable()
export class UpdateTag implements UseCaseImplementation<UpdateTagRequest, UpdateTagResponse> {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute({ id, name, color }: UpdateTagRequest): Promise<UpdateTagResponse> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      return left(new TagNotFoundException());
    }

    if (name) {
      const tagSlug = new Slug(name);

      const tagWithSameSlug = await this.tagRepository.findBySlug(tagSlug.name);

      if (tagWithSameSlug) {
        return left(new TagAlreadyExistsException());
      }

      tag.slug = tagSlug.name;
      tag.name = name;
    }

    if (color) {
      tag.color = color;
    }

    await this.tagRepository.save(tag);

    return right({ tag });
  }
}
