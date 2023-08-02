import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Telegraf } from 'telegraf';

@EventsHandler(NotificationCreatedEvent)
export class TelegramNotificationCreatedEventHandler
  implements IEventHandler<NotificationCreatedEvent>, OnModuleDestroy
{
  private telegraf: Telegraf;

  constructor(private readonly configService: ConfigService) {
    this.telegraf = new Telegraf(this.configService.get('TELEGRAM_NOTIFICATION_BOT'));
  }

  onModuleDestroy() {
    if (this.telegraf) {
      this.telegraf.stop('Finished serving notifications');
    }
  }

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

  async handle({ payload }: NotificationCreatedEvent) {
    const message = this.parseContent(payload.content.toString());

    await this.telegraf.telegram.sendMessage(payload.recipientId, message, {
      parse_mode: 'MarkdownV2',
      entities: [
        {
          type: 'bold',
          offset: 201,
          length: 5,
        },
      ],
    });
  }
}
