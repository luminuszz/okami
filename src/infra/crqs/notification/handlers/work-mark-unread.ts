import { S3FileStorageAdapter } from '@app/infra/storage/s3FileStorage.adapter';
import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { Category } from '@domain/work/enterprise/entities/work';
import { Inject, OnModuleInit } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

interface ContentObject {
  name: string;
  imageUrl: string;
  chapter: number;
  message: string;
  url: string;
}

@EventsHandler(WorkMarkUnreadEvent)
export class NotificationWorkMarkUnreadEventHandler implements IEventHandler<WorkMarkUnreadEvent>, OnModuleInit {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private clientEmitter: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.clientEmitter.connect();
  }

  async handle({ payload }: WorkMarkUnreadEvent) {
    const message =
      payload.category === Category.ANIME
        ? `${payload.name} - Episódio Novo disponível !`
        : `${payload.name} - Capítulo Novo disponível !`;

    const imageUrl = S3FileStorageAdapter.createS3FileUrl(`${payload.id}-${payload.imageId}`);

    const content = {
      chapter: payload.chapter.getChapter(),
      imageUrl: imageUrl,
      message,
      name: payload.name,
      url: payload.url,
    } satisfies ContentObject;

    this.clientEmitter.emit('create-notification', {
      content: JSON.stringify(content),
      recipientId: payload.userId,
      channels: ['on-new-chapter'],
      providers: ['all'],
    });
  }
}
