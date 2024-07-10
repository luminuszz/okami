import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';

interface DeleteSearchTokenRequest {
  searchTokenId: string;
}

type DeleteSearchTokenResponse = Either<Error, void>;

@Injectable()
export class DeleteSearchToken implements UseCaseImplementation<DeleteSearchTokenRequest, DeleteSearchTokenResponse> {
  constructor(private searchTokenRepository: SearchTokenRepository) {}

  async execute({ searchTokenId }: DeleteSearchTokenRequest): Promise<DeleteSearchTokenResponse> {
    const searchToken = await this.searchTokenRepository.findById(searchTokenId);

    if (!searchToken) {
      return left(new Error('Search token not found'));
    }

    await this.searchTokenRepository.delete(searchTokenId);

    return right(null);
  }
}
