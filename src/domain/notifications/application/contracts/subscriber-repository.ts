import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';

export abstract class SubscriberRepository {
  abstract create(subscriber: Subscriber): Promise<void>;
  abstract findById(subscriberId: string): Promise<Subscriber | null>;
  abstract save(subscriber: Subscriber): Promise<void>;
  abstract findByRecipientId(recipientId: string): Promise<Subscriber | null>;
  abstract getSubscriptions(subscriberId: string): Promise<Subscriber | null>;
  abstract getSubscriptionsByRecipientId(recipientId: string): Promise<Subscriber | null>;
  abstract findByEmail(email: string): Promise<Subscriber | null>;
}
