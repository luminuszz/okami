import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSearchToken } from '@domain/work/application/usecases/delete-search-token';

export class DeleteSearchTokenCommand {
  constructor(public readonly searchTokenId: string) {}
}

@CommandHandler(DeleteSearchTokenCommand)
export class DeleteSearchTokenCommandHandler implements ICommandHandler<DeleteSearchTokenCommand> {
  constructor(private readonly deleteSearchTokenUseCase: DeleteSearchToken) {}

  async execute({ searchTokenId }: DeleteSearchTokenCommand): Promise<void> {
    const results = await this.deleteSearchTokenUseCase.execute({
      searchTokenId,
    });

    if (results.isLeft()) throw results.value;
  }
}
