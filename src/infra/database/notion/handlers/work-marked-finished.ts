import { WorkMarkedFinishedEvent } from '@domain/work/enterprise/entities/events/work-marked-finished-event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '@infra/database/notion/notion-work.repository';

export class WorkMarkFinishedNotionEventHandlerError extends Error {
  constructor(
    public readonly message: string,
    public readonly originalEvent: WorkMarkedFinishedEvent,
  ) {
    super(message);
  }
}

@EventsHandler(WorkMarkedFinishedEvent)
export class WorkMarkedNotionFinishedEventHandler implements IEventHandler<WorkMarkedFinishedEvent> {
  constructor(private workNotionRepository: NotionWorkRepository) {}

  async handle(event: WorkMarkedFinishedEvent): Promise<void> {
    try {
      const { payload } = event;

      await this.workNotionRepository.moveWorkToFinishedStatus(payload.recipientId);
    } catch (e) {
      throw new WorkMarkFinishedNotionEventHandlerError(e.message, event);
    }
  }
}
