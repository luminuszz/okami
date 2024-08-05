import {
  FetchUserWorksWithFilterUseCase,
  Status,
} from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export interface FetchUserWorksWithFilterQueryParams {
  status?: Status;
  search?: string;
}

export class FetchUserWorksWithFilterQuery {
  constructor(
    public readonly userId: string,
    public readonly searchParams: FetchUserWorksWithFilterQueryParams,
  ) {}
}

@QueryHandler(FetchUserWorksWithFilterQuery)
export class FetchUserWorksWithFilterQueryHandler implements IQueryHandler<FetchUserWorksWithFilterQuery> {
  constructor(private readonly fetchUserWorksWithFilter: FetchUserWorksWithFilterUseCase) {}

  async execute({ searchParams, userId }: FetchUserWorksWithFilterQuery) {
    const results = await this.fetchUserWorksWithFilter.execute({
      userId,
      status: searchParams.status,
      search: searchParams.search,
    });

    if (results.isLeft()) {
      throw results.value;
    }

    return results.value.works;
  }
}
