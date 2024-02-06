import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import {
  NotificationType,
  UserNotificationSubscription,
} from '@domain/notification/enterprise/entities/user-notification-subscription';
import { UserNotificationSubscriptionRepository } from '../repositories/user-notification-subscription.repository';

interface CreateUserNotificationSubscriptionUseCaseProps {
  subscriptionId: string;
  userId: string;
  notificationType: NotificationType;
}

type CreateUserNotificationSubscriptionUseCaseResponse = Either<UserNotFound, UserNotificationSubscription>;

export class CreateUserNotificationSubscriptionUseCase
  implements
    UseCaseImplementation<
      CreateUserNotificationSubscriptionUseCaseProps,
      CreateUserNotificationSubscriptionUseCaseResponse
    >
{
  constructor(private userNotificationSubscriptionRepository: UserNotificationSubscriptionRepository) {}

  async execute({
    subscriptionId,
    userId,
    notificationType,
  }: CreateUserNotificationSubscriptionUseCaseProps): Promise<CreateUserNotificationSubscriptionUseCaseResponse> {
    const userNotificationSubscription = UserNotificationSubscription.create({
      subscriptionId,
      userId,
      createdAt: new Date(),
      notificationType,
    });

    await this.userNotificationSubscriptionRepository.create(userNotificationSubscription);

    return right(userNotificationSubscription);
  }
}
