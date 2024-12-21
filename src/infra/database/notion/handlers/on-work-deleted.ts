import { WorkDeletedEvent } from '@domain/work/enterprise/entities/events/work-deleted';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotionWorkRepository } from '../notion-work.repository';

@EventsHandler(WorkDeletedEvent)
export class OnWorkDeletedHandler implements IEventHandler<WorkDeletedEvent> {
  constructor(private readonly workNotionRepository: NotionWorkRepository) {}

  private logger = new Logger(OnWorkDeletedHandler.name);

  async handle({ payload: work }: WorkDeletedEvent) {
    if (!work.recipientId) return;

    await this.workNotionRepository.deleteSyncIdInNotionPage(work.recipientId);

    this.logger.log(`Work with id ${work.id} was deleted, moving to archive`);

    await this.workNotionRepository.moveWorkToArchive(work.recipientId);

    this.logger.log(`Work with id ${work.id} was moved to archive`);
  }
}
