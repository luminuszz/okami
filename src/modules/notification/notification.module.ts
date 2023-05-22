import { DatabaseModule } from '@app/infra/database/database.module';
import { CreateNotificationUseCase } from '@domain/notification/application/use-cases/create-notification';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNotificationCommandHandler } from './commands/createNotification.command';
import { TelegramNotificationCreatedEventHandler } from './handlers/telegram-notification-created-event-handler';

const CommandHandlers = [CreateNotificationCommandHandler];
const EventHandlers = [TelegramNotificationCreatedEventHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [...CommandHandlers, ...EventHandlers, CreateNotificationUseCase],
})
export class NotificationModule {}
