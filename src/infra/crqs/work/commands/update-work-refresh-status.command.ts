import { RefreshStatus } from '@domain/work/enterprise/entities/work';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRefreshStatusUseCase } from '@domain/work/application/usecases/update-refresh-status';

export class UpdateWorkRefreshStatusCommand {
  constructor(
    public readonly workId: string,
    public readonly refreshStatus: RefreshStatus,
  ) {}
}

@CommandHandler(UpdateWorkRefreshStatusCommand)
export class UpdateWorkRefreshStatusCommandHandler implements ICommandHandler<UpdateWorkRefreshStatusCommand> {
  constructor(
    private readonly updateWorkRefreshStatus: UpdateRefreshStatusUseCase,
    private eventBus: EventBus,
  ) {}

  async execute({ refreshStatus, workId }: UpdateWorkRefreshStatusCommand): Promise<any> {
    const results = await this.updateWorkRefreshStatus.execute({
      refreshStatus,
      workId,
    });

    if (results.isRight()) {
      await this.eventBus.publishAll(results.value.events);
    } else {
      throw results.value;
    }
  }
}
