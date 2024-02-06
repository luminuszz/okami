import { UserNotificationSubscription } from '@domain/notification/enterprise/entities/user-notification-subscription';

export class InMemoryUserNotificationSubscriptionRepository {
  public userNotificationSubscriptions: UserNotificationSubscription[] = [];

  async create(userNotificationSubscription: UserNotificationSubscription): Promise<void> {
    this.userNotificationSubscriptions.push(userNotificationSubscription);
  }
}
