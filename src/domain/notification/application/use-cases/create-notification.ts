import { Notification } from '@domain/notification/enterprise/entities/notification';
import { Content } from '@domain/notification/enterprise/values-objects/content';
import { NotificationRepository } from '../repositories/notification.repository';

interface CreateNotificationInput {
  content: string;
  recipientId: string;
}

interface CreateNotificationDtoOutput {
  notification: Notification;
}

export class CreateNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    content,
    recipientId,
  }: CreateNotificationInput): Promise<CreateNotificationDtoOutput> {
    const notification = Notification.create({
      content: new Content(content),
      recipientId,
      readAt: null,
    });

    await this.notificationRepository.create(notification);

    return {
      notification,
    };
  }
}
