import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WorkUpdatedEvent } from '@domain/work/enterprise/entities/events/work-updated';
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository';

@EventsHandler(WorkUpdatedEvent)
export class WorkUpdatedHandler implements IEventHandler<WorkUpdatedEvent> {
  constructor(private readonly notionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkUpdatedEvent): Promise<void> {
    await this.notionRepository.save(payload);
  }
}
