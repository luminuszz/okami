import { CreateWorkInput, CreateWorkUseCase } from '@domain/work/application/usecases/create-work';
import { Work } from '@domain/work/enterprise/entities/work';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class CreateWorkCommand {
  constructor(public payload: CreateWorkInput) {}
}

class WorkAsCreatedEvent {
  constructor(public payload: Work) {}
}

@CommandHandler(CreateWorkCommand)
export class CreateWorkHandler implements ICommandHandler<CreateWorkCommand> {
  constructor(
    private publisher: EventBus,
    private createWork: CreateWorkUseCase,
  ) {}

  async execute({ payload }: CreateWorkCommand): Promise<any> {
    const response = await this.createWork.execute(payload);

    if (response.isLeft()) throw response.value;

    this.publisher.publish(new WorkAsCreatedEvent(response.value.work));
  }
}
