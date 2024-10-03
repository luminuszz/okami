import { TelegrafProvider } from '../providers/telegraf.provider';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotificationCreated } from '@domain/notifications/enterprise/events/notification-created';
import { WorkContentObject } from '@infra/crqs/notification/handlers/dto';
import { can } from '@infra/crqs/notification/handlers/utils';
import { Providers } from '@domain/notifications/enterprise/entities/notifications';

@EventsHandler(NotificationCreated)
export class TelegramNotificationHandler implements IEventHandler<NotificationCreated> {
  constructor(private readonly telegrafProvider: TelegrafProvider) {}

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

    const {
      subscriber: { props: subscriber },
      message,
      url,
      imageUrl,
    } = JSON.parse(notification.content) as WorkContentObject;

    if (!subscriber.telegramChatId) return;

    const caption = this.parseContent(`${message.toString()}\n\n${url}`);

    const isAllowedImageFiletype = ['png', 'jpg', 'jpeg', 'webp'].includes(imageUrl?.split('.')?.pop() ?? '');

    if (isAllowedImageFiletype) {
      void this.telegrafProvider.bot.telegram.sendPhoto(subscriber.telegramChatId, imageUrl, {
        caption,
        parse_mode: 'MarkdownV2',
      });
    } else {
      void this.telegrafProvider.bot.telegram.sendMessage(subscriber.telegramChatId, this.parseContent(message), {
        parse_mode: 'MarkdownV2',
      });
    }
  }
}
