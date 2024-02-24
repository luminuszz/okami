import { UpdateNotionDatabaseId } from '@domain/auth/application/useCases/update-notion-database-id';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class UpdateNotionDatabaseIdCommand {
  constructor(
    public readonly userId: string,
    public readonly notionDatabaseId: string,
  ) {}
}

@CommandHandler(UpdateNotionDatabaseIdCommand)
export class UpdateNotionDatabaseIdCommandHandler implements ICommandHandler<UpdateNotionDatabaseIdCommand> {
  constructor(
    private readonly setNotionDatabaseId: UpdateNotionDatabaseId,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ notionDatabaseId, userId }: UpdateNotionDatabaseIdCommand): Promise<any> {
    const response = await this.setNotionDatabaseId.execute({
      notionDatabaseId,
      userId,
    });

    if (response.isLeft()) {
      throw response.value;
    }

    const { user } = response.value;

    await this.eventBus.publishAll(user.events);
  }
}
