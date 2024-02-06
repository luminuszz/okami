import { CreateNotificationUseCase } from '@domain/notification/application/useCases/create-notification';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNotificationCommandHandler } from './commands/createNotification.command';
import { TelegramNotificationCreatedEventHandler } from './handlers/telegram-notification-created-event-handler';
import { NotificationWorkMarkUnreadEventHandler } from './handlers/work-mark-unread';
import { OneSignalApiProvider } from '@infra/crqs/notification/providers/oneSignal-api.provider';
import { OneSignalNotificationCreatedEventHandler } from '@infra/crqs/notification/handlers/oneSignal-notification-created-event-handler';
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';
import { DatabaseModule } from '@infra/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { WorkRefreshStatusEventHandler } from '@infra/crqs/notification/handlers/work-refresh-status-updated';
import { CreateBrowserUserNotificationSubscriptionCommandHandler } from './commands/create-user-notification-subscription.command';
import { CreateUserNotificationSubscriptionUseCase } from '@domain/notification/application/useCases/create-user-notification-subscription';
import { WebPushNotificationCreatedEventHandler } from './handlers/webPush-notification-created-handler';

const CommandHandlers = [CreateNotificationCommandHandler];
const EventHandlers = [
  TelegramNotificationCreatedEventHandler,
  NotificationWorkMarkUnreadEventHandler,
  OneSignalNotificationCreatedEventHandler,
  WebPushNotificationCreatedEventHandler,
  DatabaseModule,
  WorkRefreshStatusEventHandler,
  CreateBrowserUserNotificationSubscriptionCommandHandler,
];

@Module({
  imports: [CqrsModule, HttpModule],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    CreateNotificationUseCase,
    OneSignalApiProvider,
    FindOneWorkUseCase,
    CreateUserNotificationSubscriptionUseCase,
  ],
})
export class NotificationModule {}
