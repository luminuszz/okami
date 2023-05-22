import { Notification } from '../entities/notification';

export class NotificationCreatedEvent {
  constructor(public payload: Notification) {}
}
