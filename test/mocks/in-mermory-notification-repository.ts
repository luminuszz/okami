import { Notification } from '@domain/notifications/enterprise/entities/notifications';

import { NotificationRepository } from '@domain/notifications/application/contracts/notification.repository';

export class InMemoryNotificationRepository implements NotificationRepository {
  public notifications: Notification[] = [];

  async findById(notificationId: string): Promise<Notification | null> {
    return this.notifications.find((notification) => notification.id === notificationId) || null;
  }

  async save(notification: Notification): Promise<void> {
    const index = this.notifications.findIndex((n) => n.id === notification.id);

    if (this.notifications[index]) {
      this.notifications[index] = notification;
    }
  }
  async fetchRecentSubscriberNotifications(subscriberId: string): Promise<Notification[]> {
    return this.notifications.filter((notification) => notification.subscriberId === subscriberId);
  }

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }
}
