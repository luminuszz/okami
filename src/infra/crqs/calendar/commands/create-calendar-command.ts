import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCalendar } from '@domain/calendar/application/useCases/create-calendar';

export class CreateCalendarCommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}

@CommandHandler(CreateCalendarCommand)
export class CreateCalendarCommandHandler implements ICommandHandler<CreateCalendarCommand> {
  constructor(private readonly stu: CreateCalendar) {}

  async execute(command: CreateCalendarCommand): Promise<void> {
    const results = await this.stu.execute({
      userId: command.userId,
      title: command.title,
      description: command.description,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
