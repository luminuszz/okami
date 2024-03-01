import { MessagingModule } from '@app/infra/messaging/messaging.module';
import { CreateNotificationUseCase } from '@domain/notification/application/useCases/create-notification';
import { CreateUserNotificationSubscriptionUseCase } from '@domain/notification/application/useCases/create-user-notification-subscription';
import { FetchUserNotificationSubscriptionUseCase } from '@domain/notification/application/useCases/fetch-user-notification-subscription-by-userId';
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';
import { OneSignalNotificationCreatedEventHandler } from '@infra/crqs/notification/handlers/oneSignal-notification-created-event-handler';
import { WorkRefreshStatusEventHandler } from '@infra/crqs/notification/handlers/work-refresh-status-updated';
import { OneSignalApiProvider } from '@infra/crqs/notification/providers/oneSignal-api.provider';
import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBrowserUserNotificationSubscriptionCommandHandler } from './commands/create-user-notification-subscription.command';
import { CreateNotificationCommandHandler } from './commands/createNotification.command';
import { OnUserCreatedEventHandler } from './handlers/on-user-created';
import { TelegramNotificationCreatedEventHandler } from './handlers/telegram-notification-created-event-handler';
import { WebPushNotificationCreatedEventHandler } from './handlers/webPush-notification-created-handler';
import { NotificationWorkMarkUnreadEventHandler } from './handlers/work-mark-unread';
import { FetchUserNotificationSubscriberByIdQueryHandler } from './queries/fetch-user-notification-subscriber-by-id.query';

const CommandHandlers = [CreateNotificationCommandHandler];
const EventHandlers = [
  TelegramNotificationCreatedEventHandler,
  NotificationWorkMarkUnreadEventHandler,
  OneSignalNotificationCreatedEventHandler,
  WebPushNotificationCreatedEventHandler,
  DatabaseModule,
  WorkRefreshStatusEventHandler,
  CreateBrowserUserNotificationSubscriptionCommandHandler,
  FetchUserNotificationSubscriberByIdQueryHandler,
  OnUserCreatedEventHandler,
];

@Module({
  imports: [CqrsModule, HttpModule, MessagingModule],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    CreateNotificationUseCase,
    OneSignalApiProvider,
    FindOneWorkUseCase,
    CreateUserNotificationSubscriptionUseCase,
    FetchUserNotificationSubscriptionUseCase,
  ],
})
export class NotificationModule {}
