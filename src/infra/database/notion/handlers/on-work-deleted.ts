import { WorkDeletedEvent } from '@domain/work/enterprise/entities/events/work-deleted';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

@EventsHandler(WorkDeletedEvent)
export class OnWorkDeletedHandler implements IEventHandler<WorkDeletedEvent> {
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle({ payload: work }: WorkDeletedEvent) {
    if (!work.recipientId) return;

    await this.workNotionRepository.moveWorkToArchive(work.recipientId);
  }
}
