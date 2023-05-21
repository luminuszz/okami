import { MarkWorkReadUseCase } from '@domain/work/application/usecases/mark-work-read';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class MarkWorkReadCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(MarkWorkReadCommand)
export class MarkWorkReadCommandHandler
  implements ICommandHandler<MarkWorkReadCommand>
{
  constructor(
    private readonly markRead: MarkWorkReadUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ id }: MarkWorkReadCommand): Promise<any> {
    const { work } = await this.markRead.execute({ id });

    this.eventBus.publishAll(work.events);
    return;
  }
}
