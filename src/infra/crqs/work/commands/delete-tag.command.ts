import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTag } from '@domain/work/application/usecases/delete-tag';

export class DeleteTagCommand {
  constructor(public readonly tagId: string) {}
}

@CommandHandler(DeleteTagCommand)
export class DeleteTagCommandHandler implements ICommandHandler<DeleteTagCommand> {
  constructor(private readonly deleteTagUseCase: DeleteTag) {}

  async execute({ tagId }: DeleteTagCommand): Promise<any> {
    const results = await this.deleteTagUseCase.execute({ tagId });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
