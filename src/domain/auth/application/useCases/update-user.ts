import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '../errors/UserNotFound';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';

interface UpdateUserRequest {
  userId: string;
  email?: string;
  name?: string;
}

type UpdateUserResponse = Either<UserNotFound, { user: User }>;

@Injectable()
export class UpdateUser implements UseCaseImplementation<UpdateUserRequest, UpdateUserResponse> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email, name, userId }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const existsUser = await this.userRepository.findById(userId);

    if (!existsUser) return left(new UserNotFound());

    existsUser.email = email ?? existsUser.email;
    existsUser.name = name ?? existsUser.name;

    await this.userRepository.save(existsUser);

    return right({
      user: existsUser,
    });
  }
}
