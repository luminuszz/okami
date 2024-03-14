import { UpdateWorkChapterUseCase } from '@domain/work/application/usecases/update-work-chapter';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class UpdateWorkChapterCommand {
  constructor(
    public readonly id: string,
    public readonly chapter: number,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateWorkChapterCommand)
export class UpdateWorkChapterCommandHandler implements ICommandHandler<UpdateWorkChapterCommand> {
  constructor(
    private updateChapter: UpdateWorkChapterUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ chapter, id, userId }: UpdateWorkChapterCommand): Promise<any> {
    const { work } = await this.updateChapter.execute({
      chapter,
      id,
      userId,
    });

    this.eventBus.publishAll(work.events);
  }
}
