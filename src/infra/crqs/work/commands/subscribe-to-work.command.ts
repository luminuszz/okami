import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeToWorkUseCase } from '@domain/work/application/usecases/subscribe-to-work';

export class SubscribeToWorkCommand {
  constructor(
    public readonly userId: string,
    public readonly workId: string,
  ) {}
}

@CommandHandler(SubscribeToWorkCommand)
export class SubscribeToWorkCommandHandler implements ICommandHandler<SubscribeToWorkCommand> {
  constructor(private subscribeToWork: SubscribeToWorkUseCase) {}

  async execute({ workId, userId }: SubscribeToWorkCommand): Promise<any> {
    const results = await this.subscribeToWork.execute({
      workId,
      subscriberId: userId,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
