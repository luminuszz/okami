import { EnvService } from '@app/infra/env/env.service';
import { OnModuleInit } from '@nestjs/common';

import * as WebPush from 'web-push';
import { WorkContentObject } from '@infra/crqs/notification/handlers/dto';
import { DeleteWebPushSubscription } from '@domain/notifications/application/use-cases/delete-web-push-subscription';
import { NotificationCreated } from '@domain/notifications/enterprise/events/notification-created';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { can } from '@infra/crqs/notification/handlers/utils';
import { Providers } from '@domain/notifications/enterprise/entities/notifications';

@EventsHandler(NotificationCreated)
export class WebPushNotificationHandler implements OnModuleInit, IEventHandler {
  constructor(
    private readonly env: EnvService,
    private readonly deleteWebPushSubscription: DeleteWebPushSubscription,
  ) {}

  onModuleInit() {
    WebPush.setVapidDetails(
      'https://okami.daviribeiro.com',
      this.env.get('WEB_PUSH_PUBLIC_KEY'),
      this.env.get('WEB_PUSH_PRIVATE_KEY'),
    );
  }

  async handle({ notification }: NotificationCreated) {
    const canNotify = can(Providers.WEB_PUSH, notification);

    if (!canNotify) return;

    const { subscriber, message, name, workId } = JSON.parse(notification.content) as WorkContentObject;

    if (!subscriber.webPushSubscriptions?.length) return;

    const { webPushSubscriptions } = subscriber;

    for (const subscription of webPushSubscriptions) {
      console.log('Sending web push notification', { subscription });
      try {
        await WebPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.webPushSubscriptionAuth,
              p256dh: subscription.webPushSubscriptionP256dh,
            },
          },
          JSON.stringify({ message, name, workId }),
        );
      } catch (error) {
        if (error instanceof WebPush.WebPushError) {
          if (error.statusCode === 410) {
            await this.deleteWebPushSubscription.execute({
              webPushSubscriptionId: subscription.id,
            });
          }
        }
      }
    }
  }
}
