import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { OneSignalApiProvider } from '@infra/crqs/notification/providers/oneSignal-api.provider';
import { Logger } from '@nestjs/common';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';
import { AxiosError } from 'axios';

@EventsHandler(NotificationCreatedEvent)
export class OneSignalNotificationCreatedEventHandler implements IEventHandler<NotificationCreatedEvent> {
  private logger = new Logger(OneSignalNotificationCreatedEventHandler.name);

  constructor(private readonly oneSignalApiProvider: OneSignalApiProvider) {}

  async handle({ payload, workReference }: NotificationCreatedEvent) {
    const { imageId, id } = workReference;

    try {
      await this.oneSignalApiProvider.sendNotification({
        content: payload.content.toString(),
        title: payload.content.toString(),
        imageUrl: S3FileStorageAdapter.createS3FileUrl(`${id}-${imageId}`),
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        this.logger.debug({
          message: 'Error sending notification',
          error: e.message,
        });
      }
    }
  }
}
