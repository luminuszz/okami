import { CreateManySearchTokens } from '@domain/work/application/usecases/create-many-search-tokens';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateManySearchTokensCommand {
  constructor(public data: Array<{ token: string; type: SearchTokenType }>) {}
}

@CommandHandler(CreateManySearchTokensCommand)
export class CreateManySearchTokensCommandHandler implements ICommandHandler<CreateManySearchTokensCommand> {
  constructor(private createManySearchTokensUseCase: CreateManySearchTokens) {}

  async execute({ data: tokens }: CreateManySearchTokensCommand): Promise<any> {
    const results = await this.createManySearchTokensUseCase.execute({
      tokens,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
