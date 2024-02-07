import { UserNotificationSubscription } from '@domain/notification/enterprise/entities/user-notification-subscription';

export abstract class UserNotificationSubscriptionRepository {
  abstract create(userNotificationSubscription: UserNotificationSubscription): Promise<void>;
  abstract getAllUserSubscriptions(userId: string): Promise<UserNotificationSubscription[]>;
}
