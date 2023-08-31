import { UpdateWorkUseCase } from '@domain/work/application/usecases/update-work';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

type UpdateWorkInput = Partial<{
  chapter: number;
  url: string;
  name: string;
}>;

export class UpdateWorkCommand {
  constructor(
    public id: string,
    public data: UpdateWorkInput,
  ) {}
}

@CommandHandler(UpdateWorkCommand)
export class UpdateWorkCommandHandler implements ICommandHandler<UpdateWorkCommand> {
  constructor(
    private readonly updateWorkUseCase: UpdateWorkUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ id, data }: UpdateWorkCommand): Promise<any> {
    const results = await this.updateWorkUseCase.execute({
      data,
      id,
    });

    if (results.isRight()) {
      const { work } = results.value;

      await this.eventBus.publishAll(work.events);
    } else {
      throw results.value;
    }
  }
}
