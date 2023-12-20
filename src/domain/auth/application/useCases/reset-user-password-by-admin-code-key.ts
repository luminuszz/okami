import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { InvalidCodeKey } from '@domain/auth/application/errors/InvalidCodeKey';
import { User } from '@domain/auth/enterprise/entities/User';

interface ResetUserPasswordByAdminCodeKeyInput {
  email: string;
  adminCodeKey: string;
  newPassword: string;
}

type ResetUserPasswordByAdminCodeKeyOutput = Either<UserNotFound | InvalidCodeKey, { user: User }>;

@Injectable()
export class ResetUserPasswordByAdminCodeKey
  implements UseCaseImplementation<ResetUserPasswordByAdminCodeKeyInput, ResetUserPasswordByAdminCodeKeyOutput>
{
  constructor(
    private userRepository: UserRepository,
    private hashProvider: HashProvider,
  ) {}

  async execute({
    newPassword,
    adminCodeKey,
    email,
  }: ResetUserPasswordByAdminCodeKeyInput): Promise<ResetUserPasswordByAdminCodeKeyOutput> {
    const userOrNull = await this.userRepository.findByEmail(email);

    if (!userOrNull) return left(new UserNotFound());

    if (!userOrNull?.adminHashCodeKey) return left(new InvalidCodeKey());

    const isCodeKeyValid = await this.hashProvider.compare(adminCodeKey, userOrNull.adminHashCodeKey);

    if (!isCodeKeyValid) return left(new InvalidCodeKey());

    userOrNull.passwordHash = await this.hashProvider.hash(newPassword);

    await this.userRepository.save(userOrNull);

    return right({ user: userOrNull });
  }
}
