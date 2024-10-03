import { UseCaseImplementation } from '@core/use-case';

import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@core/either';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';

interface UpdateSubscriberByRecipientIdProps {
  recipientId: string;
  email: string;
}

type UpdateSubscriberByRecipientIdResponse = Either<ResourceNotFound, { subscriber: Subscriber }>;

@Injectable()
export class UpdateSubscriberEmailByRecipientId
  implements UseCaseImplementation<UpdateSubscriberByRecipientIdProps, UpdateSubscriberByRecipientIdResponse>
{
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute({
    email,
    recipientId,
  }: UpdateSubscriberByRecipientIdProps): Promise<UpdateSubscriberByRecipientIdResponse> {
    const existsSubscriber = await this.subscriberRepository.findByRecipientId(recipientId);

    if (!existsSubscriber) {
      return left(new ResourceNotFound('Subscriber not found'));
    }

    existsSubscriber.email = email;

    await this.subscriberRepository.save(existsSubscriber);

    return right({
      subscriber: existsSubscriber,
    });
  }
}
