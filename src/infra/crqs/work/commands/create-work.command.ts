import { RegisterNewWork, RegisterNewWorkRequest } from '@domain/work/application/usecases/register-new-work';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class CreateWorkCommand {
  constructor(public payload: RegisterNewWorkRequest) {}
}

@CommandHandler(CreateWorkCommand)
export class CreateWorkHandler implements ICommandHandler<CreateWorkCommand> {
  constructor(
    private publisher: EventBus,
    private registerWork: RegisterNewWork,
  ) {}

  async execute({ payload }: CreateWorkCommand): Promise<any> {
    const response = await this.registerWork.execute(payload);

    if (response.isLeft()) throw response.value;

    const { work } = response.value;

    await this.publisher.publishAll(work.events);
  }
}
