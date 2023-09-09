import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchForWorkersReadQuery {}

@QueryHandler(FetchForWorkersReadQuery)
export class FetchForWorkersReadQueryHandler implements IQueryHandler<FetchForWorkersReadQuery> {
  constructor(private readonly fetchForWorkersRead: FetchForWorkersReadUseCase) {}

  async execute({}: FetchForWorkersReadQuery) {
    const results = await this.fetchForWorkersRead.execute();

    if (results.isLeft()) throw results.value;

    return results.value.works;
  }
}
