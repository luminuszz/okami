import { Either, right } from '@core/either';
import { Notification } from '@domain/notification/enterprise/entities/notification';
import { Content } from '@domain/notification/enterprise/values-objects/content';
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';

interface CreateNotificationInput {
  content: string;
  recipientId: string;
}

type CreateNotificationDtoOutput = Either<
  undefined,
  {
    notification: Notification;
  }
>;

@Injectable()
export class CreateNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({ content, recipientId }: CreateNotificationInput): Promise<CreateNotificationDtoOutput> {
    const notification = Notification.create({
      content: new Content(content),
      recipientId,
      readAt: null,
    });

    await this.notificationRepository.create(notification);

    return right({ notification });
  }
}
