import { MessageService } from '@app/infra/messaging/messaging-service';
import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { Category } from '@domain/work/enterprise/entities/work';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

interface ContentObject {
  name: string;
  imageUrl: string;
  chapter: number;
  message: string;
  url: string;
  nextChapter: number;
}

@EventsHandler(WorkMarkUnreadEvent)
export class NotificationWorkMarkUnreadEventHandler implements IEventHandler<WorkMarkUnreadEvent> {
  constructor(private clientEmitter: MessageService) {}

  async handle({ payload }: WorkMarkUnreadEvent) {
    const predicate = payload.category === Category.MANGA ? 'Capítulo' : 'Episódio';

    const message = `
    Obra Atualizada - ${payload.name} !
    Novo ${predicate} de ${payload.name} - ${predicate} ${payload?.nextChapter?.getChapter()} disponível !
    
    ${payload.url}
    `;

    const imageUrl = CloudFlareR2StorageAdapter.createS3FileUrl(`${payload.id}-${payload.imageId}`);

    const content = {
      chapter: payload.chapter.getChapter(),
      imageUrl: imageUrl,
      message,
      name: payload.name,
      url: payload.url,
      nextChapter: payload.nextChapter.getChapter(),
    } satisfies ContentObject;

    this.clientEmitter.emit('create-notification', {
      content: JSON.stringify(content),
      recipientId: payload.userId,
      channels: ['on-new-chapter'],
      providers: ['all'],
    });
  }
}
