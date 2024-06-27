import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repositories/tag-repository';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Tag } from '@domain/work/enterprise/entities/tag';

interface FetchAllTagsPagedRequest {
  page: number;
}

type FetchAllTagsPagedResponse = Either<never, { tags: Tag[] }>;

@Injectable()
export class FetchAllTagsPaged implements UseCaseImplementation<FetchAllTagsPagedRequest, FetchAllTagsPagedResponse> {
  constructor(private readonly tagRepository: TagRepository) {}
  async execute({ page }: FetchAllTagsPagedRequest): Promise<FetchAllTagsPagedResponse> {
    const tags = await this.tagRepository.fetchAllTagsPaged(page);

    return right({
      tags,
    });
  }
}
