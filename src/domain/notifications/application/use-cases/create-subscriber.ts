import { UseCaseImplementation } from '@core/use-case';

import { Either, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';

export interface CreateSubscriberProps {
  recipientId: string;
  email: string;
  telegramChatId?: string;
  webPushSubscriptionAuth?: string;
  webPushSubscriptionP256dh?: string;
  mobilePushToken?: string;
}

type CreateSubscriberResponse = Either<void, { subscriber: Subscriber }>;

@Injectable()
export class CreateSubscriber implements UseCaseImplementation<CreateSubscriberProps, CreateSubscriberResponse> {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(payload: CreateSubscriberProps): Promise<CreateSubscriberResponse> {
    const subscriber = Subscriber.create({
      recipientId: payload.recipientId,
      telegramChatId: payload.telegramChatId,
      email: payload.email,
    });

    await this.subscriberRepository.create(subscriber);

    return right({ subscriber });
  }
}
