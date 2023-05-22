import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read.';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

@EventsHandler(WorkMarkReadEvent)
export class WorkMarkReadEventHandler
  implements IEventHandler<WorkMarkReadEvent>
{
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkMarkReadEvent) {
    await this.workNotionRepository.updateForNewChapterFalse(
      payload.recipientId,
    );
  }
}
