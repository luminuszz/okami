import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { TokenNotFoundError, TokenRevokedError } from '@domain/auth/application/errors/Token';

interface VerifyAccessTokenInput {
  token: string;
}

type VerifyAccessTokenOutput = Either<TokenNotFoundError | TokenRevokedError, { isValid: boolean }>;

@Injectable()
export class VerifyApiAccessTokenUseCase
  implements UseCaseImplementation<VerifyAccessTokenInput, VerifyAccessTokenOutput>
{
  constructor(private readonly accessTokenRepository: AccessTokenRepository) {}

  async execute({ token }: VerifyAccessTokenInput): Promise<VerifyAccessTokenOutput> {
    const accessTokenOfUndefined = await this.accessTokenRepository.findByToken(token);

    if (!accessTokenOfUndefined) {
      return left(new TokenNotFoundError());
    }

    if (accessTokenOfUndefined.revokedAt !== null) {
      return left(new TokenRevokedError());
    }

    return right({
      isValid: true,
    });
  }
}
