import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';

interface CreateSearchTokenRequest {
  token: string;
  type: SearchTokenType;
}

export type CreateSearchTokenResponse = Either<any, { searchToken: SearchToken }>;
@Injectable()
export class CreateSearchToken implements UseCaseImplementation<CreateSearchTokenRequest, CreateSearchTokenResponse> {
  constructor(private repository: SearchTokenRepository) {}

  async execute({ token, type }: CreateSearchTokenRequest): Promise<CreateSearchTokenResponse> {
    const searchToken = SearchToken.create({ token, type });

    await this.repository.create(searchToken);

    return right({ searchToken });
  }
}
