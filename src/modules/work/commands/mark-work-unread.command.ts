import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class MarkWorkUnreadCommand {
  constructor(public readonly id: string) {}
}

export class MarkWorkUnreadCommandError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@CommandHandler(MarkWorkUnreadCommand)
export class MarkWorkUnreadCommandHandler
  implements ICommandHandler<MarkWorkUnreadCommand>
{
  constructor(
    private readonly markUnread: MarkWorkUnreadUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ id }: MarkWorkUnreadCommand): Promise<void> {
    try {
      const { work } = await this.markUnread.execute({ id });

      this.eventBus.publishAll(work.events);
    } catch (err) {
      throw new MarkWorkUnreadCommandError(err.message);
    }
  }
}
