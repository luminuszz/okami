import { WebPushSubscription } from '@domain/notifications/enterprise/entities/web-push-subscription';

export abstract class WePushSubscriptionRepository {
  abstract create(webPushSubscription: WebPushSubscription): Promise<void>;
  abstract findById(id: string): Promise<WebPushSubscription | null>;
  abstract findSubscriptionByEndpoint(endpoint: string): Promise<WebPushSubscription | null>;
  abstract save(webPushSubscription: WebPushSubscription): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
