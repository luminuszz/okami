import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';
import { Notification } from '@domain/notifications/enterprise/entities/notifications';

export interface NotificationPublisherPayload {
  notification: Notification;
  subscriber: Subscriber;
}

export abstract class NotificationPublisher {
  abstract publish(payload: NotificationPublisherPayload): Promise<void>;
}
