import { UserNotificationSubscriptionRepository } from '@domain/notification/application/repositories/user-notification-subscription.repository';
import { UserNotificationSubscription } from '@domain/notification/enterprise/entities/user-notification-subscription';

export class InMemoryUserNotificationSubscriptionRepository implements UserNotificationSubscriptionRepository {
  public userNotificationSubscriptions: UserNotificationSubscription[] = [];

  async create(userNotificationSubscription: UserNotificationSubscription): Promise<void> {
    this.userNotificationSubscriptions.push(userNotificationSubscription);
  }

  async getAllUserSubscriptions(userId: string): Promise<UserNotificationSubscription[]> {
    return this.userNotificationSubscriptions.filter((subscription) => subscription.userId === userId);
  }
}
