import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchForWorkersReadQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(FetchForWorkersReadQuery)
export class FetchForWorkersReadQueryHandler implements IQueryHandler<FetchForWorkersReadQuery> {
  constructor(private readonly fetchForWorkersRead: FetchForWorkersReadUseCase) {}

  async execute({ userId }: FetchForWorkersReadQuery) {
    const results = await this.fetchForWorkersRead.execute({ userId });

    if (results.isLeft()) throw results.value;

    return results.value.works;
  }
}
