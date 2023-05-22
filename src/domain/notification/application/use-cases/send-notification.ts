import { Notification } from '@domain/notification/enterprise/entities/notification';
import { Content } from '@domain/notification/enterprise/values-objects/content';
import { SendNotificationProvider } from '../providers/send-notification-provider';
import { NotificationRepository } from '../repositories/notification.repository';

interface SendNotificationInput {
  content: string;
  recipientId: string;
}

interface SendNotificationDtoOutput {
  notification: Notification;
}

export class SendNotificationUseCase {
  constructor(
    private notificationRepository: NotificationRepository,
    private readonly sendNotification: SendNotificationProvider,
  ) {}

  async execute({
    content,
    recipientId,
  }: SendNotificationInput): Promise<SendNotificationDtoOutput> {
    const notification = Notification.create({
      content: new Content(content),
      recipientId,
      readAt: null,
    });

    await this.notificationRepository.create(notification);

    await this.sendNotification.send(notification);

    return {
      notification,
    };
  }
}
