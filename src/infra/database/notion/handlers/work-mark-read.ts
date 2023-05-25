import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read.';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

@EventsHandler(WorkMarkReadEvent)
export class WorkMarkReadNotionEventHandler
  implements IEventHandler<WorkMarkReadEvent>
{
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  async handle({ payload }: WorkMarkReadEvent) {
    console.log({ payload });

    await this.workNotionRepository.updateForNewChapterFalse(
      payload.recipientId,
      payload.chapter.getChapter(),
    );
  }
}
