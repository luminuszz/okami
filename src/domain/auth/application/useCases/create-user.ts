import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { UserAlreadyExists } from '@domain/auth/application/errors/UserAlreadyExists';

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export type CreateUserOutput = Either<UserAlreadyExists, { user: User }>;

@Injectable()
export class CreateUserUseCase implements UseCaseImplementation<CreateUserInput, CreateUserOutput> {
  constructor(
    private hashProvider: HashProvider,
    private userRepository: UserRepository,
  ) {}

  async execute({ password, email, name }: CreateUserInput): Promise<CreateUserOutput> {
    const userOrUndefined = await this.userRepository.findByEmail(email);

    if (userOrUndefined) {
      return left(new UserAlreadyExists());
    }

    const passwordHash = await this.hashProvider.hash(password);

    const user = User.create({ email, passwordHash, name });

    await this.userRepository.create(user);

    return right({ user });
  }
}
