import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { UserNotFound } from '../errors/UserNotFound';
import { UserRepository } from './repositories/user-repository';

interface UpdateNotionDatabaseIdProps {
  notionDatabaseId: string;
  userId: string;
}

type UpdateNotionDatabaseResponse = Either<UserNotFound, { user: User }>;

@Injectable()
export class UpdateNotionDatabaseId
  implements UseCaseImplementation<UpdateNotionDatabaseIdProps, UpdateNotionDatabaseResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ notionDatabaseId, userId }: UpdateNotionDatabaseIdProps): Promise<UpdateNotionDatabaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) return left(new UserNotFound());

    user.notionDatabaseId = notionDatabaseId;

    await this.userRepository.save(user);

    return right({ user });
  }
}
