import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { randomUUID } from 'node:crypto';
import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { AccessToken } from '@domain/auth/enterprise/entities/AccessToken';

interface CreateApiAccessTokenInput {
  user_id: string;
}

type CreateApiAccessTokenOutput = Either<UserNotFound, { accessToken: AccessToken }>;

@Injectable()
export class CreateApiAccessToken
  implements UseCaseImplementation<CreateApiAccessTokenInput, CreateApiAccessTokenOutput>
{
  constructor(private readonly userRepository: UserRepository, private accessTokenRepository: AccessTokenRepository) {}

  async execute({ user_id }: CreateApiAccessTokenInput): Promise<CreateApiAccessTokenOutput> {
    const userOrUndefined = await this.userRepository.findById(user_id);

    if (!userOrUndefined) {
      return left(new UserNotFound());
    }

    const token = `${userOrUndefined.id}--${randomUUID()}-${Date.now()}`;

    const accessToken = AccessToken.create({
      token,
      createdAt: new Date(),
      revokedAt: null,
      userId: userOrUndefined.id,
    });

    await this.accessTokenRepository.create(accessToken);

    return right({
      accessToken,
    });
  }
}
