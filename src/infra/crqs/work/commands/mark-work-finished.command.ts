import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { MarkWorkFinishedUseCase } from '@domain/work/application/usecases/mark-work-finished';

export class MarkWorkFinishedCommand {
  constructor(
    public readonly workId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(MarkWorkFinishedCommand)
export class MarkWorkFinishedCommandHandler implements ICommandHandler<MarkWorkFinishedCommand> {
  constructor(
    private readonly markWorkFinished: MarkWorkFinishedUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ workId, userId }: MarkWorkFinishedCommand): Promise<void> {
    const results = await this.markWorkFinished.execute({ workId, userId });

    if (results.isRight()) {
      const { work } = results.value;
      this.eventBus.publishAll(work.events);
    } else {
      throw results.value;
    }
  }
}
