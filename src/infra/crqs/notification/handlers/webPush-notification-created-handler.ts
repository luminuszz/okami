import { EnvSecrets } from '@app/infra/utils/getSecretsEnv';
import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import WebPush from 'web-push';

@EventsHandler(NotificationCreatedEvent)
export class WebPushNotificationCreatedEventHandler implements IEventHandler<NotificationCreatedEvent>, OnModuleInit {
  constructor(private readonly configService: ConfigService<EnvSecrets>) {}

  onModuleInit() {
    WebPush.setVapidDetails(
      'https://okami.daviribeiro.com',
      this.configService.get('WEB_PUSH_PUBLIC_KEY'),
      this.configService.get('WEB_PUSH_PRIVATE_KEY'),
    );
  }
  handle({ payload, workReference }: NotificationCreatedEvent) {
    console.log('WebPushNotificationCreatedEventHandler', payload, workReference);
  }
}
