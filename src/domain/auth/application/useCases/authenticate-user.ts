import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { HashProvider } from '@domain/auth/application/contracts/hash-provider';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { User } from '@domain/auth/enterprise/entities/User';

interface AuthenticateUserInput {
  email: string;
  password: string;
}

type AuthenticateUserOutput = Either<UserNotFound, { isAuthenticated: boolean; user: User }>;

@Injectable()
export class AuthenticateUserUseCase implements UseCaseImplementation<AuthenticateUserInput, AuthenticateUserOutput> {
  constructor(private readonly hashProvider: HashProvider, private readonly userRepository: UserRepository) {}

  async execute({ password, email }: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const userOrUndefined = await this.userRepository.findByEmail(email);

    if (!userOrUndefined) {
      return left(new UserNotFound());
    }

    const passwordMatch = await this.hashProvider.compare(password, userOrUndefined.passwordHash);

    if (!passwordMatch) {
      return left(new UserNotFound());
    }

    return right({
      isAuthenticated: true,
      user: userOrUndefined,
    });
  }
}
