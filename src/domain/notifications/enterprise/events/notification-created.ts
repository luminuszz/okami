import { DomainEvent } from '@core/entities/entity';
import { Notification } from '../entities/notifications';

export class NotificationCreated implements DomainEvent<Notification> {
  eventName: string;
  payload: Notification;

  constructor(public readonly notification: Notification) {
    this.eventName = NotificationCreated.name;
    this.payload = notification;
  }
}
