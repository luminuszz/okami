import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read.';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';


export class WorkMarkReadNotionEventHandlerError extends Error {
  constructor(message: string, public readonly originalPayload: any) {
    super(message);
  }
}

@EventsHandler(WorkMarkReadEvent)
export class WorkMarkReadNotionEventHandler
  implements IEventHandler<WorkMarkReadEvent>
{
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkMarkReadEvent) {
    try {
      await this.workNotionRepository.updateForNewChapterFalse(
        payload.recipientId,
        payload.chapter.getChapter(),
      );
    } catch (err) {
      throw new WorkMarkReadNotionEventHandlerError(err.message, payload);
    }
  }
}
