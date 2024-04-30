import { CreateTag } from '@domain/work/application/usecases/create-tag';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateTagCommand {
  constructor(public readonly name: string) {}
}

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler implements ICommandHandler<CreateTagCommand> {
  constructor(private readonly createTag: CreateTag) {}

  async execute({ name }: CreateTagCommand): Promise<any> {
    const response = await this.createTag.execute({ name });

    if (response.isLeft()) {
      throw response.value;
    }
  }
}
