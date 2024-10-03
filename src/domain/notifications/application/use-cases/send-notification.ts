import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { InvalidOperation } from '@core/errors/invalid-operation';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { NotificationRepository } from '@domain/notifications/application/contracts/notification.repository';
import { ChannelsLabels, Notification, ProvidersLabels } from '@domain/notifications/enterprise/entities/notifications';

interface SendNotificationUseCaseProps {
  content: string;
  subscriberId: string;
  channels: ChannelsLabels[];
  providers: ProvidersLabels[];
}

type SendNotificationUseCaseResponse = Either<InvalidOperation | ResourceNotFound, { notification: Notification }>;

@Injectable()
export class SendNotificationUseCase
  implements UseCaseImplementation<SendNotificationUseCaseProps, SendNotificationUseCaseResponse>
{
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute({
    content,
    subscriberId,
    channels,
    providers,
  }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      subscriberId: subscriberId,
      createdAt: new Date(),
      channels: channels,
      providers: providers,
    });

    await this.notificationRepo.create(notification);

    return right({ notification });
  }
}
