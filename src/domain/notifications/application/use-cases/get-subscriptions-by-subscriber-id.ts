import { Either, right } from '@core/either';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';

type Response = Either<void, { subscriber: Subscriber | null }>;

export class GetSubscriptionBySubscriberId {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(subscriberId: string): Promise<Response> {
    const results = await this.subscriberRepository.getSubscriptions(subscriberId);

    return right({
      subscriber: results,
    });
  }
}
