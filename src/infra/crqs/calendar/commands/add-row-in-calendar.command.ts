import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar';
import { DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class AddRowInCalendarCommand {
  constructor(
    public readonly workId: string,
    public readonly calendarId: string,
    public readonly dayOfWeek: DaysOfWeek,
    public readonly userId: string,
  ) {}
}

@CommandHandler(AddRowInCalendarCommand)
export class AddRowInCalendarCommandHandler implements ICommandHandler<AddRowInCalendarCommand> {
  constructor(private readonly stu: AddWorkInCalendar) {}

  async execute(command: AddRowInCalendarCommand): Promise<void> {
    const results = await this.stu.execute({
      workId: command.workId,
      calendarId: command.calendarId,
      dayOfWeek: command.dayOfWeek,
      userId: command.userId,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
