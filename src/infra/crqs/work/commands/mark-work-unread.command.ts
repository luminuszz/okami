import { MarkWorkUnreadUseCase } from '@domain/work/application/usecases/mark-work-unread';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class MarkWorkUnreadCommand {
  constructor(
    public readonly id: string,
    public nextChapter?: number,
  ) {}
}

@CommandHandler(MarkWorkUnreadCommand)
export class MarkWorkUnreadCommandHandler implements ICommandHandler<MarkWorkUnreadCommand> {
  constructor(
    private readonly markUnread: MarkWorkUnreadUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ id, nextChapter }: MarkWorkUnreadCommand): Promise<void> {
    const response = await this.markUnread.execute({ id, nextChapter });

    if (response.isRight()) {
      const work = response.value;

      this.eventBus.publishAll(work.events);
    } else {
      throw response.value;
    }
  }
}
