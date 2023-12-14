import { NotificationCreatedEvent } from '@domain/notification/enterprise/events/notificationCreated';
import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Telegraf } from 'telegraf';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';

@EventsHandler(NotificationCreatedEvent)
export class TelegramNotificationCreatedEventHandler
  implements IEventHandler<NotificationCreatedEvent>, OnModuleDestroy
{
  private readonly telegraf: Telegraf;

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

  async handle({ payload, workReference }: NotificationCreatedEvent) {
    const { imageId, id, url } = workReference;

    const caption = this.parseContent(`${payload.content.toString()}\n\n${url}`);

    const isAllowedImageFiletype = ['png', 'jpg', 'jpeg'].includes(imageId?.split('.').pop());

    if (imageId && isAllowedImageFiletype) {
      const imageUrl = S3FileStorageAdapter.createS3FileUrl(`${id}-${imageId}`);
      await this.telegraf.telegram.sendPhoto(payload.recipientId, imageUrl, {
        parse_mode: 'MarkdownV2',
        caption,
      });
    } else {
      await this.telegraf.telegram.sendMessage(payload.recipientId, caption, {
        parse_mode: 'MarkdownV2',
      });
    }
  }
}
