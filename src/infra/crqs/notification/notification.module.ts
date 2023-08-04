import { DatabaseModule } from '@app/infra/database/database.module';
import { CreateNotificationUseCase } from '@domain/notification/application/useCases/create-notification';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNotificationCommandHandler } from './commands/createNotification.command';
import { TelegramNotificationCreatedEventHandler } from './handlers/telegram-notification-created-event-handler';
import { NotificationWorkMarkUnreadEventHandler } from './handlers/work-mark-unread';

const CommandHandlers = [CreateNotificationCommandHandler];
const EventHandlers = [TelegramNotificationCreatedEventHandler, NotificationWorkMarkUnreadEventHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [...EventHandlers, ...CommandHandlers, CreateNotificationUseCase],
})
export class NotificationModule {}
