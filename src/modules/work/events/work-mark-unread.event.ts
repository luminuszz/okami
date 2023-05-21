import { WorkMarkReadEvent } from '@domain/work/enterprise/entities/events/work-marked-read.';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(WorkMarkReadEvent)
export class WorkMarkUnreadEventHandler
  implements IEventHandler<WorkMarkReadEvent>
{
  private logger = new Logger(WorkMarkUnreadEventHandler.name);

  async handle({ payload }: WorkMarkReadEvent) {
    this.logger.log(
      `WorkMarkUnreadEventHandler.handle() => name: ${payload.name}`,
    );
  }
}
