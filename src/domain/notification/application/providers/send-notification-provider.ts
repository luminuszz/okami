import { Notification } from '@domain/notification/enterprise/entities/notification';

export abstract class SendNotificationProvider {
  abstract send(notification: Notification): Promise<void>;
}
