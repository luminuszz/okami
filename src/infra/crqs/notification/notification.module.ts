import { DatabaseModule } from '@app/infra/database/database.module';
import { CreateNotificationUseCase } from '@domain/notification/application/useCases/create-notification';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNotificationCommandHandler } from './commands/createNotification.command';
import { TelegramNotificationCreatedEventHandler } from './handlers/telegram-notification-created-event-handler';
import { NotificationWorkMarkUnreadEventHandler } from './handlers/work-mark-unread';
import { HttpModule } from '@nestjs/axios';
import { OneSignalApiProvider } from '@infra/crqs/notification/providers/oneSignal-api.provider';
import { OneSignalNotificationHandler } from '@infra/crqs/notification/handlers/oneSignal-notification.handler';
import { FindOneWorkUseCase } from '@domain/work/application/usecases/fnd-one-work';

const CommandHandlers = [CreateNotificationCommandHandler];
const EventHandlers = [
  TelegramNotificationCreatedEventHandler,
  NotificationWorkMarkUnreadEventHandler,
  OneSignalNotificationHandler,
];

@Module({
  imports: [CqrsModule, DatabaseModule, HttpModule],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    CreateNotificationUseCase,
    OneSignalApiProvider,
    FindOneWorkUseCase,
  ],
})
export class NotificationModule {}
