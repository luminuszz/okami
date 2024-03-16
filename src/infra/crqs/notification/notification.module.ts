import { MessagingModule } from '@app/infra/messaging/messaging.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OnUserCreatedEventHandler } from './handlers/on-user-created';
import { OnUserEmailUpdatedHandler } from './handlers/on-user-email-updated';
import { NotificationWorkMarkUnreadEventHandler } from './handlers/work-mark-unread';

@Module({
  imports: [CqrsModule, HttpModule, MessagingModule],
  providers: [NotificationWorkMarkUnreadEventHandler, OnUserCreatedEventHandler, OnUserEmailUpdatedHandler],
})
export class NotificationModule {}
