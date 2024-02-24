import {
  FetchUserWorksWithFilterUseCase,
  Status,
} from '@domain/work/application/usecases/fetch-user-works-with-filter';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchUserWorksWithFilterQuery {
  constructor(
    public readonly userId: string,
    public readonly status: Status,
  ) {}
}

@QueryHandler(FetchUserWorksWithFilterQuery)
export class FetchUserWorksWithFilterQueryHandler implements IQueryHandler<FetchUserWorksWithFilterQuery> {
  constructor(private readonly fetchUserWorksWithFilter: FetchUserWorksWithFilterUseCase) {}

  async execute({ status, userId }: FetchUserWorksWithFilterQuery) {
    const results = await this.fetchUserWorksWithFilter.execute({
      userId,
      status,
    });

    if (results.isLeft()) {
      throw results.value;
    }

    return results.value.works;
  }
}
