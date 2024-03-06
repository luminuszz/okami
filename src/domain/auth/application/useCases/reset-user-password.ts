import { Either, left, right } from '@core/either';
import { UserNotFound } from '../errors/UserNotFound';
import { User } from '@domain/auth/enterprise/entities/User';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { HashProvider } from '../contracts/hash-provider';

interface ResetUserPasswordRequest {
  resetPasswordCode: string;
  newPassword: string;
}

type ResetUserPasswordResponse = Either<UserNotFound, { user: User }>;

@Injectable()
export class ResetUserPassword implements UseCaseImplementation<ResetUserPasswordRequest, ResetUserPasswordResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({ newPassword, resetPasswordCode }: ResetUserPasswordRequest): Promise<ResetUserPasswordResponse> {
    const existsUser = await this.userRepository.finsUserByPasswordResetCode(resetPasswordCode);

    if (!existsUser) {
      return left(new UserNotFound());
    }

    existsUser.passwordHash = await this.hashProvider.hash(newPassword);

    existsUser.resetPasswordCode = null;

    await this.userRepository.save(existsUser);

    return right({ user: existsUser });
  }
}
