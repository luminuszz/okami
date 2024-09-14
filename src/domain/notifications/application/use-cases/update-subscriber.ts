import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';

interface UpdateSubscriberProps {
  subscriberId: string;
  telegramChatId?: string;
}

type UpdateSubscriberResponse = Either<ResourceNotFound, { subscriber: Subscriber }>;

@Injectable()
export class UpdateSubscriber implements UseCaseImplementation<UpdateSubscriberProps, UpdateSubscriberResponse> {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute({ subscriberId, ...data }: UpdateSubscriberProps): Promise<UpdateSubscriberResponse> {
    const subscriberOrNull = await this.subscriberRepository.findById(subscriberId);

    if (!subscriberOrNull) return left(new ResourceNotFound('Subscriber'));

    subscriberOrNull.telegramChatId = data.telegramChatId ?? '';

    await this.subscriberRepository.save(subscriberOrNull);

    return right({
      subscriber: subscriberOrNull,
    });
  }
}
