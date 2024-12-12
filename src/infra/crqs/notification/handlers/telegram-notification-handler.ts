import { Providers } from '@domain/notifications/enterprise/entities/notifications';
import { NotificationCreated } from '@domain/notifications/enterprise/events/notification-created';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { WorkContentObject } from '@infra/crqs/notification/handlers/dto';
import { can } from '@infra/crqs/notification/handlers/utils';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

const SEND_TELEGRAM_CHAT_QUEUE = 'SEND_TELEGRAM_NOTIFICATION';

@EventsHandler(NotificationCreated)
export class TelegramNotificationHandler implements IEventHandler<NotificationCreated> {
  constructor(private readonly queue: QueueProvider) {}

  private parseContent(content: string): string {
    return content
      .replaceAll('_', '\\_')
      .replaceAll('**', '\\**')
      .replaceAll('[', '\\[')
      .replaceAll(']', '\\]')
      .replaceAll('`', '\\`')
      .replaceAll('-', '\\-')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')
      .replaceAll('.', '\\.')
      .replaceAll('!', '\\!')
      .replaceAll('>', '\\>')
      .replaceAll('<', '\\<');
  }

  public async handle({ notification }: NotificationCreated): Promise<void> {
    const canNotify = can(Providers.MOBILE_PUSH, notification);

    if (!canNotify) return;

    const { subscriber, message, url, imageUrl } = JSON.parse(notification.content) as WorkContentObject;

    if (!subscriber.telegramChatId) return;

    await this.queue.publish(SEND_TELEGRAM_CHAT_QUEUE, {
      message,
      imageUrl,
      url,
      chatId: subscriber.telegramChatId,
    });
  }
}
