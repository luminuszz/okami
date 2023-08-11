import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';

interface FindUserByIdUseCaseInput {
  id: string;
}

type FindUserByIdUseCaseOutput = Either<UserNotFound, { user: User }>;

@Injectable()
export class FindUserByIdUseCase implements UseCaseImplementation<FindUserByIdUseCaseInput, FindUserByIdUseCaseOutput> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: FindUserByIdUseCaseInput): Promise<FindUserByIdUseCaseOutput> {
    const userOrUndefined = await this.userRepository.findById(id);

    if (!userOrUndefined) {
      return left(new UserNotFound());
    }

    return right({ user: userOrUndefined });
  }
}
