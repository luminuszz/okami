import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { WorkNotFoundError } from './errors/work-not-found';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Injectable } from '@nestjs/common';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { TagRepository } from '../repositories/tag-repository';

interface CreateTagRequest {
  name: string;
}

type CreateTagResponse = Either<WorkNotFoundError, { tag: Tag }>;

@Injectable()
export class CreateTag implements UseCaseImplementation<CreateTagRequest, CreateTagResponse> {
  constructor(private tagRepository: TagRepository) {}

  async execute({ name }: CreateTagRequest): Promise<CreateTagResponse> {
    const slug = new Slug(name);

    const exitsTag = await this.tagRepository.findBySlug(slug.name);

    if (exitsTag) {
      return right({ tag: exitsTag });
    }

    const tag = Tag.create({ name, slug });

    await this.tagRepository.create(tag);

    return right({ tag });
  }
}
