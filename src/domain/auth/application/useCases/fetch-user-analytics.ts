import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '../errors/UserNotFound';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';

interface FetchUserAnalyticsRequest {
  userId: string;
}

export interface AnalyticsResponse {
  totalOfWorksRead: number;
  totalOfWorksCreated: number;
  totalOfWorksUnread: number;
  totalOfWorksFinished: number;
}

type FetchUserAnalyticsResponse = Either<UserNotFound, AnalyticsResponse>;

@Injectable()
export class FetchUserAnalytics
  implements UseCaseImplementation<FetchUserAnalyticsRequest, FetchUserAnalyticsResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: FetchUserAnalyticsRequest): Promise<FetchUserAnalyticsResponse> {
    const existsUser = await this.userRepository.findById(userId);

    if (!existsUser) {
      return left(new UserNotFound());
    }

    const { totalOfWorksCreated, totalOfWorksFinished, totalOfWorksRead, totalOfWorksUnread } =
      await this.userRepository.fetchUserMetaData(userId);

    return right({
      totalOfWorksCreated,
      totalOfWorksFinished,
      totalOfWorksRead,
      totalOfWorksUnread,
    });
  }
}
