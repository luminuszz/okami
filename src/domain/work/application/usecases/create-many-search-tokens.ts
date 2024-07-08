import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { Injectable } from '@nestjs/common';
import { SearchTokenRepository } from '../repositories/search-token-repository';

interface CreateSearchTokenDTO {
  tokens: Array<{
    token: string;
    type: SearchTokenType;
  }>;
}

type Response = Either<never, { searchTokens: SearchToken[] }>;

@Injectable()
export class CreateManySearchTokens implements UseCaseImplementation<CreateSearchTokenDTO, Response> {
  constructor(private readonly searchTokenRepository: SearchTokenRepository) {}

  async execute({ tokens }: CreateSearchTokenDTO): Promise<Response> {
    const searchTokens = tokens.map(({ token, type }) => {
      return SearchToken.create({
        token,
        type,
      });
    });

    await this.searchTokenRepository.createMany(searchTokens);

    return right({
      searchTokens,
    });
  }
}
