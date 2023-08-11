import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { User } from '@domain/auth/enterprise/entities/User';

export class FindUserByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(private readonly findUserById: FindUserByIdUseCase) {}

  async execute({ id }: FindUserByIdQuery): Promise<User> {
    const results = await this.findUserById.execute({ id });

    if (results.isLeft()) {
      throw results.value;
    }

    return results.value.user;
  }
}
