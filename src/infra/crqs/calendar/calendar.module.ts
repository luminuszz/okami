import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar'
import { CreateCalendar } from '@domain/calendar/application/useCases/create-calendar'
import { RemoveRowFromCalendar } from '@domain/calendar/application/useCases/remove-row-from-calendar'
import { AddRowInCalendarCommandHandler } from '@infra/crqs/calendar/commands/add-row-in-calendar.command'
import { CreateCalendarCommandHandler } from '@infra/crqs/calendar/commands/create-calendar-command'
import { RemoveRowFromCalendarCommandHandler } from '@infra/crqs/calendar/commands/remove-row-from-calendar.command'
import { CreateCalendarOnNewUserHandler } from '@infra/crqs/calendar/handlers/create-calendar-on-new-user.handler'
import { FetchUserCalendarWithRowsQueryHandler } from '@infra/crqs/calendar/queries/fetch-user-calendar-with-rows.query'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

const CommandHandlers = [
  CreateCalendarCommandHandler,
  AddRowInCalendarCommandHandler,
  RemoveRowFromCalendarCommandHandler,
]

const QueryHandlers = [FetchUserCalendarWithRowsQueryHandler]

const EventHandlers = [CreateCalendarOnNewUserHandler]

@Module({
  imports: [CqrsModule.forRoot()],
  providers: [
    CreateCalendar,
    AddWorkInCalendar,
    RemoveRowFromCalendar,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class CalendarModule {}
