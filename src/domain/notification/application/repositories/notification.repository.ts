import { Notification } from '@domain/notification/enterprise/entities/notification';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
}
