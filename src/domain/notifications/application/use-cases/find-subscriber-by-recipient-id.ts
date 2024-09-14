import { UseCaseImplementation } from '@core/use-case';

import { Either, left, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';

interface FindSubscriberByIdRequest {
  recipientId: string;
}

type FindSubscriberByIdResponse = Either<ResourceNotFound, { subscriber: Subscriber }>;

@Injectable()
export class FindSubscriberByRecipientId
  implements UseCaseImplementation<FindSubscriberByIdRequest, FindSubscriberByIdResponse>
{
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute({ recipientId }: FindSubscriberByIdRequest): Promise<FindSubscriberByIdResponse> {
    const subscriber = await this.subscriberRepository.findByRecipientId(recipientId);

    if (!subscriber) {
      return left(new ResourceNotFound('Subscriber not found'));
    }

    return right({
      subscriber,
    });
  }
}
