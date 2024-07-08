import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSearchToken } from '@domain/work/application/usecases/create-search-token';

export class CreateSearchTokenCommand {
  constructor(
    public token: string,
    public type: SearchTokenType,
  ) {}
}

@CommandHandler(CreateSearchTokenCommand)
export class CreateSearchTokenCommandHandler implements ICommandHandler<CreateSearchTokenCommand> {
  constructor(private readonly searchTokenUserCase: CreateSearchToken) {}

  async execute({ token, type }: CreateSearchTokenCommand): Promise<void> {
    const results = await this.searchTokenUserCase.execute({
      token,
      type,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
