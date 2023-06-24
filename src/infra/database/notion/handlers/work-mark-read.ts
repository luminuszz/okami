import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

export class WorkMarkReadNotionEventHandlerError extends Error {
  constructor(message: string, public readonly originalEvent: WorkMarkReadEvent) {
    super(message);
  }
}

@EventsHandler(WorkMarkReadEvent)
export class WorkMarkReadNotionEventHandler implements IEventHandler<WorkMarkReadEvent> {
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle(event: WorkMarkReadEvent) {
    const { payload } = event;

    try {
      await this.workNotionRepository.updateForNewChapterFalse(payload.recipientId, payload.chapter.getChapter());
    } catch (err) {
      throw new WorkMarkReadNotionEventHandlerError(err.message, event);
    }
  }
}
