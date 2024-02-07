import { EnvSecrets } from '@app/infra/utils/getSecretsEnv';
import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import WebPush from 'web-push';

import { FetchUserNotificationSubscriptionUseCase } from '@domain/notification/application/useCases/fetch-user-notification-subscription-by-userId';

@EventsHandler(NotificationCreatedEvent)
export class WebPushNotificationCreatedEventHandler implements IEventHandler<NotificationCreatedEvent>, OnModuleInit {
  constructor(
    private readonly configService: ConfigService<EnvSecrets>,
    private readonly fetchUserSubscriptionByUserId: FetchUserNotificationSubscriptionUseCase,
  ) {}

  onModuleInit() {
    WebPush.setVapidDetails(
      'https://okami.daviribeiro.com',
      this.configService.get('WEB_PUSH_PUBLIC_KEY'),
      this.configService.get('WEB_PUSH_PRIVATE_KEY'),
    );
  }
  async handle({ payload }: NotificationCreatedEvent) {
    const results = await this.fetchUserSubscriptionByUserId.execute({
      userId: this.configService.get('CURRENT_USER_ID'),
    });

    if (payload.content.toString().includes('Erro')) return;

    if (results.isRight()) {
      const subscriptions = results.value;

      for (const subscription of subscriptions) {
        try {
          await WebPush.sendNotification(
            {
              endpoint: subscription.credentials.endpoint,
              keys: {
                auth: subscription.credentials.keys.auth,
                p256dh: subscription.credentials.keys.p256dh,
              },
            },
            payload.content.toString(),
          );
        } catch (error) {
          console.log('Error sending notification', error);
        }
      }
    }
  }
}
