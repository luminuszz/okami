import { FetchAllTagsPaged } from '@domain/work/application/usecases/fetch-all-tags-paged';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchPagedTagsQuery {
  constructor(public readonly page: number) {}
}

@QueryHandler(FetchPagedTagsQuery)
export class FetchPagedTagsQueryHandler implements IQueryHandler<FetchPagedTagsQuery> {
  constructor(private readonly fetchPagedTags: FetchAllTagsPaged) {}

  async execute({ page }: FetchPagedTagsQuery): Promise<any> {
    const results = await this.fetchPagedTags.execute({ page });

    if (results.isLeft()) {
      throw results.value;
    }

    return results.value.tags;
  }
}
