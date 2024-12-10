import { EnvService } from '@app/infra/env/env.service';
import { Providers } from '@domain/notifications/enterprise/entities/notifications';
import { NotificationCreated } from '@domain/notifications/enterprise/events/notification-created';
import { WorkContentObject } from '@infra/crqs/notification/handlers/dto';
import { can } from '@infra/crqs/notification/handlers/utils';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { map } from 'lodash';
import { firstValueFrom } from 'rxjs';

@EventsHandler(NotificationCreated)
export class OneSignalNotificationPublisher implements IEventHandler<NotificationCreated> {
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {}

  private logger = new Logger(OneSignalNotificationPublisher.name);

  public async handle({ notification }): Promise<void> {
    const canNotify = can(Providers.MOBILE_PUSH, notification);

    if (!canNotify) return;

    const content = JSON.parse(notification.content) as WorkContentObject;

    const { subscriber } = content;

    if (!subscriber.mobilePushSubscriptions?.length) return;

    const subscribersTokens = map(subscriber.mobilePushSubscriptions, 'subscriptionToken');

    console.log(this.envService.get('ONE_SIGNAL_SERVICE_ENDPOINT'));

    const results = (await firstValueFrom(
      this.httpService.post<any>('notifications', {
        app_id: this.envService.get('ONE_SIGNAL_APP_ID'),
        target_channel: 'push',
        include_subscription_ids: subscribersTokens,
        contents: {
          en: content.message,
        },
      }),
      null,
    )) as any;

    this.logger.debug(JSON.stringify(results.data));

    if (results?.data?.errors?.invalid_player_ids) {
      this.logger.error(`Invalid player ids: ${results.errors.invalid_player_ids}`);
    }
  }
}
