import { Either, left, right } from '@core/either';
import { InvalidOperation } from '@core/errors/invalid-operation';
import { UseCaseImplementation } from '@core/use-case';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { RefreshTokenRepository } from './repositories/refresh-token-repository';

export interface ValidateRefreshTokenRequest {
  refreshToken: string;
}

export type ValidateRefreshTokenResponse = Either<InvalidOperation, { refreshToken: RefreshToken }>;

@Injectable()
export class ValidateRefreshToken
  implements UseCaseImplementation<ValidateRefreshTokenRequest, ValidateRefreshTokenResponse>
{
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute({ refreshToken }: ValidateRefreshTokenRequest): Promise<ValidateRefreshTokenResponse> {
    const refreshTokenExists = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!refreshTokenExists) {
      return left(new InvalidOperation('Invalid refresh token'));
    }

    const refreshTokenIsExpired = dayjs(refreshTokenExists.expiresAt).isBefore(dayjs().unix());

    if (refreshTokenIsExpired) {
      return left(new InvalidOperation('refresh token invalid'));
    }

    return right({
      refreshToken: refreshTokenExists,
    });
  }
}
