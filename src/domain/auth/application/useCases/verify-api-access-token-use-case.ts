import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { TokenNotFoundError, TokenRevokedError } from '@domain/auth/application/errors/Token';
import { User } from '@domain/auth/enterprise/entities/User';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';

interface VerifyAccessTokenInput {
  token: string;
}

type VerifyAccessTokenOutput = Either<TokenNotFoundError | TokenRevokedError, { isValid: boolean; owner: User }>;

@Injectable()
export class VerifyApiAccessTokenUseCase
  implements UseCaseImplementation<VerifyAccessTokenInput, VerifyAccessTokenOutput>
{
  constructor(
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ token }: VerifyAccessTokenInput): Promise<VerifyAccessTokenOutput> {
    const accessTokenOfUndefined = await this.accessTokenRepository.findByToken(token);

    if (!accessTokenOfUndefined) {
      return left(new TokenNotFoundError());
    }

    if (accessTokenOfUndefined.revokedAt !== null) {
      return left(new TokenRevokedError());
    }

    const owner = await this.userRepository.findById(accessTokenOfUndefined.userId);

    return right({
      isValid: true,
      owner,
    });
  }
}
