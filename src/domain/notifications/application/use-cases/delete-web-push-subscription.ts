import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { WePushSubscriptionRepository } from '@domain/notifications/application/contracts/web-push-subscription-repository';

interface DeleteWebPushSubscriptionInput {
  webPushSubscriptionId: string;
}

type DeleteWebPushSubscriptionOutput = Either<ResourceNotFound, null>;

@Injectable()
export class DeleteWebPushSubscription
  implements UseCaseImplementation<DeleteWebPushSubscriptionInput, DeleteWebPushSubscriptionOutput>
{
  constructor(private webPushSubscriptionRepository: WePushSubscriptionRepository) {}

  async execute({ webPushSubscriptionId }: DeleteWebPushSubscriptionInput): Promise<DeleteWebPushSubscriptionOutput> {
    const webPushSubscription = this.webPushSubscriptionRepository.findById(webPushSubscriptionId);

    if (!webPushSubscription) {
      return left(new ResourceNotFound("Web push subscription doesn't exist."));
    }

    return right(null);
  }
}
