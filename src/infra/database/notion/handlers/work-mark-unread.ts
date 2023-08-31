import { WorkMarkUnreadEvent } from '@domain/work/enterprise/entities/events/work-marked-unread';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository';

export class WorkMarkUnreadNotionEventHandlerError extends Error {
  constructor(
    public readonly message: string,
    public readonly originalEvent: WorkMarkUnreadEvent,
  ) {
    super(message);
  }
}

@EventsHandler(WorkMarkUnreadEvent)
export class WorkMarkUnreadNotionEventHandler implements IEventHandler<WorkMarkUnreadEvent> {
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle(event: WorkMarkUnreadEvent) {
    const { payload } = event;

    try {
      await this.workNotionRepository.updateForNewChapter(payload.recipientId);
    } catch (err) {
      throw new WorkMarkUnreadNotionEventHandlerError(err.message, event);
    }
  }
}
