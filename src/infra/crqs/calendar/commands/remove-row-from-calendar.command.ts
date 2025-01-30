import { RemoveRowFromCalendar } from '@domain/calendar/application/useCases/remove-row-from-calendar'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

export class RemoveRowFromCalendarCommand {
  constructor(
    public readonly rowId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(RemoveRowFromCalendarCommand)
export class RemoveRowFromCalendarCommandHandler implements ICommandHandler<RemoveRowFromCalendarCommand> {
  constructor(private readonly removeRowFromCalendar: RemoveRowFromCalendar) {}

  async execute({ userId, rowId }: RemoveRowFromCalendarCommand): Promise<any> {
    const results = await this.removeRowFromCalendar.execute({ userId, rowId })

    if (results.isLeft()) {
      throw results.value
    }
  }
}
