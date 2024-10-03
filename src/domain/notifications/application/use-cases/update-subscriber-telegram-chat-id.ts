import { Either, left, right } from '@core/either';
import { Injectable } from '@nestjs/common';
import { UseCaseImplementation } from '@core/use-case';
import { FindSubscriberByRecipientId } from './find-subscriber-by-recipient-id';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';

interface UpdateTelegramChatIdProps {
  recipientId: string;
  telegramChatId: string;
}

type UpdateTelegramChatIdResponse = Either<ResourceNotFound, { subscriber: Subscriber }>;

@Injectable()
export class UpdateSubscriberTelegramChatId
  implements UseCaseImplementation<UpdateTelegramChatIdProps, UpdateTelegramChatIdResponse>
{
  constructor(
    private readonly subscriberRepository: SubscriberRepository,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  async execute({ recipientId, telegramChatId }: UpdateTelegramChatIdProps): Promise<UpdateTelegramChatIdResponse> {
    const results = await this.findSubscriberByRecipientId.execute({ recipientId });

    if (results.isLeft()) {
      return left(results.value);
    }

    const { subscriber } = results.value;

    subscriber.telegramChatId = telegramChatId;

    await this.subscriberRepository.save(subscriber);

    return right({
      subscriber,
    });
  }
}
