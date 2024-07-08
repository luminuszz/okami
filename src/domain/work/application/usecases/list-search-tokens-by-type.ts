import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';

interface ListSearchTokensByTypeRequest {
  type: SearchTokenType;
}

type ListSearchTokensByTypeResponse = Either<never, { searchTokens: SearchToken[] }>;

@Injectable()
export class ListSearchTokensByType
  implements UseCaseImplementation<ListSearchTokensByTypeRequest, ListSearchTokensByTypeResponse>
{
  constructor(private readonly searchTokenRepository: SearchTokenRepository) {}

  async execute({ type }: ListSearchTokensByTypeRequest): Promise<ListSearchTokensByTypeResponse> {
    const results = await this.searchTokenRepository.fetchByType(type);

    return right({ searchTokens: results });
  }
}
