import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class MarkWorkUnreadCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(MarkWorkUnreadCommand)
export class MarkWorkUnreadCommandHandler
  implements ICommandHandler<MarkWorkUnreadCommand>
{
  constructor(
    private readonly markUnread: MarkWorkUnreadUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ id }: MarkWorkUnreadCommand): Promise<any> {
    const { work } = await this.markUnread.execute({ id });

    console.log('work', work.events);

    this.eventBus.publishAll(work.events);
    return;
  }
}
