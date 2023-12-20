import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';

interface SetAdminHashCodeKeyUseCaseInput {
  userId: string;
  hashCodeKey: string;
}

type SetAdminHashCodeKeyUseCaseOutput = Either<UserNotFound, void>;

@Injectable()
export class SetAdminHashCodeKeyUseCase
  implements UseCaseImplementation<SetAdminHashCodeKeyUseCaseInput, SetAdminHashCodeKeyUseCaseOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({ hashCodeKey, userId }: SetAdminHashCodeKeyUseCaseInput): Promise<SetAdminHashCodeKeyUseCaseOutput> {
    const userOrNull = await this.userRepository.findById(userId);

    if (!userOrNull) {
      return left(new UserNotFound());
    }

    userOrNull.adminHashCodeKey = await this.hashProvider.hash(hashCodeKey);

    await this.userRepository.save(userOrNull);

    return right(null);
  }
}
