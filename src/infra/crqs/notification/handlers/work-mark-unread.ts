import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { Category } from '@domain/work/enterprise/entities/work';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendNotificationUseCase } from '@domain/notifications/application/use-cases/send-notification';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';
import { WorkContentObject } from '@infra/crqs/notification/handlers/dto';

export interface CreateNotificationEventPayload {
  content: string;
  recipientId: string;
  channels: string[];
  providers: string[];
}

@EventsHandler(WorkMarkUnreadEvent)
export class NotificationWorkMarkUnreadEventHandler implements IEventHandler<WorkMarkUnreadEvent> {
  constructor(
    private readonly sendNotification: SendNotificationUseCase,
    private readonly subscriberRepository: SubscriberRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle({ payload }: WorkMarkUnreadEvent) {
    const subscriber = await this.subscriberRepository.findByRecipientId(payload.id);

    if (!subscriber) return;

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
      workId: payload.id,
      subscriber: subscriber,
    } satisfies WorkContentObject;

    const results = await this.sendNotification.execute({
      channels: ['on-new-chapter'],
      providers: ['all'],
      content: JSON.stringify(content),
      recipientId: subscriber.recipientId,
    });

    if (results.isLeft()) {
      throw results.value;
    }

    const { notification } = results.value;

    await this.eventBus.publishAll(notification.events);
  }
}
