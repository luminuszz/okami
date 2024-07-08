import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListSearchTokensByType } from '@domain/work/application/usecases/list-search-tokens-by-type';

export class FetchForSearchTokensByTypeQuery {
  constructor(public readonly type: SearchTokenType) {}
}

@QueryHandler(FetchForSearchTokensByTypeQuery)
export class FetchForSearchTokensByTypeQueryHandler implements IQueryHandler<FetchForSearchTokensByTypeQuery> {
  constructor(private readonly fetchForSearchTokensByType: ListSearchTokensByType) {}

  async execute({ type }: FetchForSearchTokensByTypeQuery): Promise<any> {
    const results = await this.fetchForSearchTokensByType.execute({
      type,
    });

    if (results.isLeft()) {
      throw results.value;
    }

    return results.value.searchTokens;
  }
}
