import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ToggleWorkFavorite } from '@domain/work/application/usecases/toggle-work-favorite';

export class ToggleFavoriteCommand {
  constructor(readonly workId: string) {}
}

@CommandHandler(ToggleFavoriteCommand)
export class ToggleFavoriteCommandHandler implements ICommandHandler<ToggleFavoriteCommand> {
  constructor(private readonly toggleFavorite: ToggleWorkFavorite) {}

  async execute({ workId }: ToggleFavoriteCommand): Promise<void> {
    const results = await this.toggleFavorite.execute({ workId });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
