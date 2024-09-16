import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OnUserCreatedEventHandler } from './handlers/on-user-created';
import { OnUserEmailUpdatedHandler } from './handlers/on-user-email-updated';
import { NotificationWorkMarkUnreadEventHandler } from './handlers/work-mark-unread';
import { EnvService } from '@infra/env/env.service';
import { OneSignalNotificationPublisher } from '@infra/crqs/notification/handlers/one-sginal-notification-handler';
import { TelegramNotificationHandler } from '@infra/crqs/notification/handlers/telegram-notification-handler';
import { WebPushNotificationHandler } from '@infra/crqs/notification/handlers/web-push-notification-handlers';
import { CreateSubscriber } from '@domain/notifications/application/use-cases/create-subscriber';
import { UpdateSubscriberTelegramChatId } from '@domain/notifications/application/use-cases/update-subscriber-telegram-chat-id';
import { UpdateSubscriberEmailByRecipientId } from '@domain/notifications/application/use-cases/update-subscriber-email-by-recipient-id';
import { SendNotificationUseCase } from '@domain/notifications/application/use-cases/send-notification';
import { TelegrafProvider } from '@infra/crqs/notification/providers/telegraf.provider';
import { SendAuthCodeEmail } from '@domain/notifications/application/use-cases/send-auth-code-mail';
import { CompareSubscriberAuthCode } from '@domain/notifications/application/use-cases/compare-subscriber-auth-code';
import { FindSubscriberByEmail } from '@domain/notifications/application/use-cases/find-subscriber-by-email';
import { DeleteWebPushSubscription } from '@domain/notifications/application/use-cases/delete-web-push-subscription';
import { FindSubscriberByRecipientId } from '@domain/notifications/application/use-cases/find-subscriber-by-recipient-id';
import { MailModule } from '@infra/mail/mail.module';
import { CreateWebPushSubscription } from '@domain/notifications/application/use-cases/create-web-push-subscription';
import { CreateMobilePushSubscription } from '@domain/notifications/application/use-cases/create-mobile-push-subscription';
import { FetchRecentSubscriberNotifications } from '@domain/notifications/application/use-cases/fetch-recent-subscriber-notifications';
import { MarkNotificationAsRead } from '@domain/notifications/application/use-cases/mark-notification-as-read';

@Module({
  imports: [
    MailModule,
    CqrsModule,
    HttpModule,
    HttpModule.registerAsync({
      useFactory: (env: EnvService) => ({
        baseURL: env.get('ONE_SIGNAL_SERVICE_ENDPOINT'),
        headers: {
          Authorization: `Basic ${env.get('ONE_SIGNAL_API_TOKEN')}`,
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    TelegrafProvider,
    NotificationWorkMarkUnreadEventHandler,
    OnUserCreatedEventHandler,
    OnUserEmailUpdatedHandler,
    OneSignalNotificationPublisher,
    TelegramNotificationHandler,
    WebPushNotificationHandler,
    CreateSubscriber,
    UpdateSubscriberTelegramChatId,
    UpdateSubscriberEmailByRecipientId,
    SendNotificationUseCase,
    SendAuthCodeEmail,
    CompareSubscriberAuthCode,
    FindSubscriberByEmail,
    DeleteWebPushSubscription,
    FindSubscriberByRecipientId,
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    FetchRecentSubscriberNotifications,
    MarkNotificationAsRead,
  ],
  exports: [
    TelegrafProvider,
    NotificationWorkMarkUnreadEventHandler,
    OnUserCreatedEventHandler,
    OnUserEmailUpdatedHandler,
    OneSignalNotificationPublisher,
    TelegramNotificationHandler,
    WebPushNotificationHandler,
    CreateSubscriber,
    UpdateSubscriberTelegramChatId,
    UpdateSubscriberEmailByRecipientId,
    SendNotificationUseCase,
    SendAuthCodeEmail,
    CompareSubscriberAuthCode,
    FindSubscriberByEmail,
    DeleteWebPushSubscription,
    FindSubscriberByRecipientId,
    CreateWebPushSubscription,
    CreateMobilePushSubscription,
    FetchRecentSubscriberNotifications,
    MarkNotificationAsRead,
  ]
})
export class NotificationModule {}
