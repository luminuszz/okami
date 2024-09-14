import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';

import { Injectable } from '@nestjs/common';
import { FindSubscriberByRecipientId } from './find-subscriber-by-recipient-id';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { InvalidOperation } from '@core/errors/invalid-operation';
import { MobilePushSubscription } from '@domain/notifications/enterprise/entities/mobile-push-subscription';
import { MobilePushSubscriptionRepository } from '@domain/notifications/application/contracts/mobile-push-subscription-repository';

interface CreateMobilePushSubscriptionRequest {
  recipientId: string;
  subscriptionToken: string;
}

type CreateMobilePushSubscriptionResponse = Either<
  ResourceNotFound | InvalidOperation,
  { mobilePushSubscription: MobilePushSubscription }
>;

@Injectable()
export class CreateMobilePushSubscription
  implements UseCaseImplementation<CreateMobilePushSubscriptionRequest, CreateMobilePushSubscriptionResponse>
{
  constructor(
    private readonly mobilePushSubscriptionRepository: MobilePushSubscriptionRepository,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  async execute({
    subscriptionToken,
    recipientId,
  }: CreateMobilePushSubscriptionRequest): Promise<CreateMobilePushSubscriptionResponse> {
    const results = await this.findSubscriberByRecipientId.execute({ recipientId });

    if (results.isLeft()) {
      return left(results.value);
    }

    const existsSubscription = await this.mobilePushSubscriptionRepository.findBySubscriptionToken(subscriptionToken);

    if (existsSubscription) {
      return left(new InvalidOperation('Subscription already exists'));
    }

    const { subscriber } = results.value;

    const mobileToken = MobilePushSubscription.create({
      createdAt: new Date(),
      subscriberId: subscriber.id,
      subscriptionToken,
    });

    await this.mobilePushSubscriptionRepository.create(mobileToken);

    return right({ mobilePushSubscription: mobileToken });
  }
}
