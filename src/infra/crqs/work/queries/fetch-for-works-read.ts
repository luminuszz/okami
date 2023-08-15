import { FetchForWorkersReadUseCase } from '@domain/work/application/usecases/fetch-for-workrers-read';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FetchForWorkersReadQuery {}

@QueryHandler(FetchForWorkersReadQuery)
export class FetchForWorkersReadQueryHandler implements IQueryHandler<FetchForWorkersReadQuery> {
  constructor(private readonly fetchForWorkersRead: FetchForWorkersReadUseCase) {}

  async execute({}: FetchForWorkersReadQuery) {
    const { works } = await this.fetchForWorkersRead.execute();

    return works;
  }
}
