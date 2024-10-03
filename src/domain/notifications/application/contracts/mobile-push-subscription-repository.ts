import { MobilePushSubscription } from '@domain/notifications/enterprise/entities/mobile-push-subscription';

export abstract class MobilePushSubscriptionRepository {
  abstract create(mobilePushSubscription: MobilePushSubscription): Promise<void>;
  abstract findBySubscriptionToken(subscriptionToken: string): Promise<MobilePushSubscription | null>;
}
