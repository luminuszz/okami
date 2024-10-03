import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { NotificationRepository } from '@domain/notifications/application/contracts/notification.repository';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';
import { Notification } from '@domain/notifications/enterprise/entities/notifications';

interface FetchRecentSubscriberNotificationsProps {
  recipientId: string;
}

type FetchRecentSubscriberNotificationsOutput = Either<ResourceNotFound, { notifications: Notification[] }>;

@Injectable()
export class FetchRecentSubscriberNotifications
  implements UseCaseImplementation<FetchRecentSubscriberNotificationsProps, FetchRecentSubscriberNotificationsOutput>
{
  constructor(
    private readonly subscriberRepository: SubscriberRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    recipientId,
  }: FetchRecentSubscriberNotificationsProps): Promise<FetchRecentSubscriberNotificationsOutput> {
    const subscriber = await this.subscriberRepository.findByRecipientId(recipientId);

    if (!subscriber) {
      return left(new ResourceNotFound('Subscriber not found'));
    }

    const notifications = await this.notificationRepository.fetchRecentSubscriberNotifications(subscriber.id);

    return right({ notifications });
  }
}
