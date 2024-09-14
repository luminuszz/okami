import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { InvalidOperation } from '@core/errors/invalid-operation';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { NotificationRepository } from '@domain/notifications/application/contracts/notification.repository';
import { ChannelsLabels, Notification, ProvidersLabels } from '@domain/notifications/enterprise/entities/notifications';
import { FindSubscriberByRecipientId } from '@domain/notifications/application/use-cases/find-subscriber-by-recipient-id';

interface SendNotificationUseCaseProps {
  content: string;
  recipientId: string;
  channels: ChannelsLabels[];
  providers: ProvidersLabels[];
}

type SendNotificationUseCaseResponse = Either<InvalidOperation | ResourceNotFound, { notification: Notification }>;

@Injectable()
export class SendNotificationUseCase
  implements UseCaseImplementation<SendNotificationUseCaseProps, SendNotificationUseCaseResponse>
{
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly findSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  async execute({
    content,
    recipientId,
    channels,
    providers,
  }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
    const results = await this.findSubscriberByRecipientId.execute({ recipientId: recipientId });

    if (results.isLeft()) return left(results.value);

    const { subscriber } = results.value;

    const notification = Notification.create({
      content,
      subscriberId: subscriber.id,
      createdAt: new Date(),
      channels: channels,
      providers: providers,
    });

    await this.notificationRepo.create(notification);

    return right({ notification });
  }
}
