import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { UserNotFound } from '../errors/UserNotFound';
import { UserRepository } from './repositories/user-repository';

interface DecreaseTrialUserWorkLimitInput {
  userId: string;
}

type DecreaseTrialUserWorkLimitOutput = Either<UserNotFound, void>;

@Injectable()
export class DecreaseTrialUserWorkLimit
  implements UseCaseImplementation<DecreaseTrialUserWorkLimitInput, DecreaseTrialUserWorkLimitOutput>
{
  constructor(private readonly useRepository: UserRepository) {}

  async execute({ userId }: DecreaseTrialUserWorkLimitInput): Promise<DecreaseTrialUserWorkLimitOutput> {
    const userOrNull = await this.useRepository.findById(userId);

    if (!userOrNull) return left(new UserNotFound());

    if (userOrNull.hasTrial) {
      userOrNull.decreaseTrialWorkLimit();

      await this.useRepository.save(userOrNull);
    }

    return right(null);
  }
}
