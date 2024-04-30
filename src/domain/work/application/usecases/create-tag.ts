import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { WorkNotFoundError } from './errors/work-not-found';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Injectable } from '@nestjs/common';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';

interface CreateTagRequest {
  name: string;
  workId: string;
}

type CreateTagResponse = Either<WorkNotFoundError, { tag: Tag }>;

@Injectable()
export class CreateTag implements UseCaseImplementation<CreateTagRequest, CreateTagResponse> {
  async execute({ name }: CreateTagRequest): Promise<CreateTagResponse> {
    const tag = Tag.create({ name, slug: new Slug(name) });

    return right({ tag });
  }
}
