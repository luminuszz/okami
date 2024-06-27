import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindOneWorkQuery {
  constructor(public id: string) {}
}

@QueryHandler(FindOneWorkQuery)
export class FindOneWorkQueryHandler implements IQueryHandler<FindOneWorkQuery> {
  constructor(private readonly findOneWork: FindOneWorkUseCase) {}

  async execute(query: FindOneWorkQuery): Promise<any> {
    const {
      value: { work },
    } = await this.findOneWork.execute(query);

    return work;
  }
}
