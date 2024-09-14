import { Either, left, right } from '@core/either';
import { Notification } from '../../enterprise/entities/notifications';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../contracts/notification.repository';
import { ResourceNotFound } from '@core/errors/resource-not-found';

interface MarkNotificationAsReadInput {
  notificationId: string;
}

type MarkNotificationAsReadOutput = Either<ResourceNotFound, { notification: Notification }>;

@Injectable()
export class MarkNotificationAsRead
  implements UseCaseImplementation<MarkNotificationAsReadInput, MarkNotificationAsReadOutput>
{
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute({ notificationId }: MarkNotificationAsReadInput): Promise<MarkNotificationAsReadOutput> {
    const existsNotification = await this.notificationRepository.findById(notificationId);

    if (!existsNotification) return left(new ResourceNotFound('Notification'));

    if (!existsNotification.readAt) {
      existsNotification.markAsRead();

      await this.notificationRepository.save(existsNotification);
    }

    return right({
      notification: existsNotification,
    });
  }
}
