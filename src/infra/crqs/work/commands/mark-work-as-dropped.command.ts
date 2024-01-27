import { MarkWorkAsDroppedUseCase } from '@domain/work/application/usecases/mark-work-as-dropped';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class MarkWorkAsDroppedCommand {
  constructor(public readonly workId: string) {}
}

@CommandHandler(MarkWorkAsDroppedCommand)
export class MarkWorkAsDroppedCommandHandler implements ICommandHandler<MarkWorkAsDroppedCommand> {
  constructor(
    private readonly markWorkAsDropped: MarkWorkAsDroppedUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ workId }: MarkWorkAsDroppedCommand): Promise<void> {
    const results = await this.markWorkAsDropped.execute({ workId });

    if (results.isLeft()) {
      throw results.value;
    }

    this.eventBus.publishAll(results.value.events);
  }
}
