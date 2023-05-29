import { MarkWorkReadUseCase } from '@domain/work/application/usecases/mark-work-read';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class MarkWorkReadCommand {
  constructor(public readonly id: string) {}
}


export class MarkWorkReadCommandError extends Error {
  constructor(message: string) {
    super(message);
  }
}


@CommandHandler(MarkWorkReadCommand)
export class MarkWorkReadCommandHandler
  implements ICommandHandler<MarkWorkReadCommand>
{
  constructor(
    private readonly markRead: MarkWorkReadUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ id }: MarkWorkReadCommand): Promise<void> {
    try {
      const { work } = await this.markRead.execute({ id });

      this.eventBus.publishAll(work.events);
    } catch (err) {
      throw new MarkWorkReadCommandError(err.message);
    }
  }
}
