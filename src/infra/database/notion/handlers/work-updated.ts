import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WorkUpdatedEvent } from '@domain/work/enterprise/entities/events/work-updated';
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository';

@EventsHandler(WorkUpdatedEvent)
export class WorkUpdatedEventHandler implements IEventHandler<WorkUpdatedEvent> {
  constructor(private readonly notionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkUpdatedEvent): Promise<void> {
    if (!payload.recipientId) return;

    await this.notionRepository.save(payload);
  }
}
