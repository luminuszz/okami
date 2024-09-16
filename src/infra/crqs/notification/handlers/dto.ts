import { Notification } from '@domain/notifications/enterprise/entities/notifications';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';

export interface NotificationPublisherPayload {
  notification: Notification;
  subscriber: Subscriber;
}

export interface WorkContentObject {
  name: string;
  imageUrl: string;
  chapter: number;
  message: string;
  url: string;
  nextChapter: number;
  workId: string;
  subscriber: Subscriber;
}
