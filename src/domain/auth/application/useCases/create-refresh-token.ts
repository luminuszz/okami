import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { HashProvider } from '../contracts/hash-provider';
import { UserNotFound } from '../errors/UserNotFound';
import { RefreshTokenRepository } from './repositories/refresh-token-repository';
import { UserRepository } from './repositories/user-repository';
import { randomUUID } from 'crypto';

interface CreateRefreshTokenDTO {
  userId: string;
}

type CreateRefreshTokenResponse = Either<UserNotFound, RefreshToken>;

@Injectable()
export class CreateRefreshTokenUseCase
  implements UseCaseImplementation<CreateRefreshTokenDTO, CreateRefreshTokenResponse>
{
  constructor(
    private readonly hashProvider: HashProvider,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: CreateRefreshTokenDTO): Promise<CreateRefreshTokenResponse> {
    const userExists = await this.userRepository.findById(userId);

    const expiresAt = dayjs().add(30, 'days').toDate();

    if (!userExists) {
      return left(new UserNotFound());
    }

    const token = randomUUID();

    const refreshToken = RefreshToken.create({
      expiresAt,
      token,
      userId: userExists.id,
      createdAt: new Date(),
    });

    await this.refreshTokenRepository.create(refreshToken);

    return right(refreshToken);
  }
}
