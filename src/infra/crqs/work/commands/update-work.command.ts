import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

type UpdateWorkInput = Partial<{
  chapter: number;
  url: string;
  name: string;
  tagsId?: string[];
  alternativeName: string;
}>;

export class UpdateWorkCommand {
  constructor(
    public id: string,
    public data: UpdateWorkInput,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateWorkCommand)
export class UpdateWorkCommandHandler implements ICommandHandler<UpdateWorkCommand> {
  constructor(
    private readonly updateWorkUseCase: UpdateWorkUseCase,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ id, data, userId }: UpdateWorkCommand): Promise<any> {
    const results = await this.updateWorkUseCase.execute({
      data,
      id,
      userId,
    });

    if (results.isRight()) {
      const { work } = results.value;

      await this.eventBus.publishAll(work.events);
    } else {
      throw results.value;
    }
  }
}
