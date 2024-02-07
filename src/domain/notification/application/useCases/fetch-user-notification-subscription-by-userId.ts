import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotificationSubscription } from '@domain/notification/enterprise/entities/user-notification-subscription';
import { Injectable } from '@nestjs/common';
import { UserNotificationSubscriptionRepository } from '../repositories/user-notification-subscription.repository';

interface FetchUserNotificationSubscriptionUseCaseRequest {
  userId: string;
}

type FetchUserNotificationSubscriptionUseCaseResponse = Either<any, UserNotificationSubscription[]>;

@Injectable()
export class FetchUserNotificationSubscriptionUseCase
  implements
    UseCaseImplementation<
      FetchUserNotificationSubscriptionUseCaseRequest,
      FetchUserNotificationSubscriptionUseCaseResponse
    >
{
  constructor(private readonly userNotificationSubscriptionRepository: UserNotificationSubscriptionRepository) {}
  async execute({
    userId,
  }: FetchUserNotificationSubscriptionUseCaseRequest): Promise<FetchUserNotificationSubscriptionUseCaseResponse> {
    const results = await this.userNotificationSubscriptionRepository.getAllUserSubscriptions(userId);

    return right(results);
  }
}
