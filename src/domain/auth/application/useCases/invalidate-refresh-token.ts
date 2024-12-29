import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '@domain/auth/application/useCases/repositories/refresh-token-repository';
import { RefreshTokenAlreadyInvalidated } from '@domain/auth/application/errors/RefreshTokenAlreadyInvalidated';

export interface InvalidateRefreshTokenProps {
  refreshToken: string;
}

export type InvalidateRefreshTokenResponse = Either<RefreshTokenAlreadyInvalidated | ResourceNotFound, null>;

@Injectable()
export class InvalidateRefreshToken
  implements UseCaseImplementation<InvalidateRefreshTokenProps, InvalidateRefreshTokenResponse>
{
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute({ refreshToken }: InvalidateRefreshTokenProps): Promise<InvalidateRefreshTokenResponse> {
    const existsRefreshToken = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!existsRefreshToken) {
      return left(new ResourceNotFound('Refresh token not found'));
    }

    const cannotInvalidate = existsRefreshToken.isInvalidated || existsRefreshToken.isExpired;

    if (cannotInvalidate) {
      return left(new RefreshTokenAlreadyInvalidated());
    }

    existsRefreshToken.invalidate();

    await this.refreshTokenRepository.save(existsRefreshToken);

    return right(null);
  }
}
