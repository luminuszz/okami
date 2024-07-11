import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTag } from '@domain/work/application/usecases/update-tag';

export class UpdateTagCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly color?: string,
  ) {}
}

@CommandHandler(UpdateTagCommand)
export class UpdateTagCommandHandler implements ICommandHandler<UpdateTagCommand> {
  constructor(private readonly updateTagUseCase: UpdateTag) {}

  async execute({ name, color, id }: UpdateTagCommand): Promise<any> {
    const results = await this.updateTagUseCase.execute({
      name,
      color,
      id,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
