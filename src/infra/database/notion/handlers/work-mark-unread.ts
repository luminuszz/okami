import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

@EventsHandler(WorkMarkUnreadEvent)
export class WorkMarkUnreadNotionEventHandler
  implements IEventHandler<WorkMarkUnreadEvent>
{
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkMarkUnreadEvent) {
    await this.workNotionRepository.updateForNewChapter(payload.recipientId);
  }
}
