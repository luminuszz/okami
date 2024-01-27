import { Notification } from '../entities/notification';
import { Work } from '@domain/work/enterprise/entities/work';

export class NotificationCreatedEvent {
  constructor(
    public payload: Notification,
    public workReference: Work,
  ) {}
}
