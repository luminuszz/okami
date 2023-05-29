import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

export class WorkMarkUnreadNotionEventHandlerError extends Error {
  constructor(message: string, public readonly originalPayload: any) {
    super(message);
  }
}

@EventsHandler(WorkMarkUnreadEvent)
export class WorkMarkUnreadNotionEventHandler
  implements IEventHandler<WorkMarkUnreadEvent>
{
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkMarkUnreadEvent) {
    try {
      await this.workNotionRepository.updateForNewChapter(payload.recipientId);
    } catch (err) {
      throw new WorkMarkUnreadNotionEventHandlerError(err.message, payload);
    }
  }
}
