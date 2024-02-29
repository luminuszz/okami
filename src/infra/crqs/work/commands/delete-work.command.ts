import { DeleteWork } from '@domain/work/application/usecases/delete-work';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteWorkCommand {
  constructor(public readonly workId: string) {}
}

@CommandHandler(DeleteWorkCommand)
export class DeleteWorkCommandHandler implements ICommandHandler<DeleteWorkCommand> {
  constructor(private readonly deleteWork: DeleteWork) {}

  async execute({ workId }: DeleteWorkCommand): Promise<any> {
    const response = await this.deleteWork.execute({ workId });

    if (response.isLeft()) throw response.value;
  }
}
