import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '../errors/UserNotFound';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';

interface GetUserTrialQuoteInput {
  userId: string;
}

type GetUserTrialQuoteOutput = Either<
  UserNotFound,
  {
    quote: number;

    limit: number;
  }
>;

@Injectable()
export class GetUserTrialQuote implements UseCaseImplementation<GetUserTrialQuoteInput, GetUserTrialQuoteOutput> {
  constructor(
    private readonly workRepository: WorkRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: GetUserTrialQuoteInput): Promise<GetUserTrialQuoteOutput> {
    const existsUser = await this.userRepository.findById(userId);

    if (!existsUser) return left(new UserNotFound());

    const totalOfWorks = await this.workRepository.fetchAllWorksByUserIdCount(userId);

    return right({
      quote: totalOfWorks,
      remainingQuotas: existsUser.trialWorkLimit - totalOfWorks,
      limit: existsUser.trialWorkLimit,
    });
  }
}
