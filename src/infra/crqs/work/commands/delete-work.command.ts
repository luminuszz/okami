import { DeleteWork } from '@domain/work/application/usecases/delete-work';
import { WorkDeletedEvent } from '@domain/work/enterprise/entities/events/work-deleted';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class DeleteWorkCommand {
  constructor(
    public readonly workId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteWorkCommand)
export class DeleteWorkCommandHandler implements ICommandHandler<DeleteWorkCommand> {
  constructor(
    private readonly deleteWork: DeleteWork,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ workId, userId }: DeleteWorkCommand): Promise<any> {
    const response = await this.deleteWork.execute({ workId, userId });

    if (response.isLeft()) throw response.value;

    const { work } = response.value;

    await this.eventBus.publish(new WorkDeletedEvent(work));
  }
}
