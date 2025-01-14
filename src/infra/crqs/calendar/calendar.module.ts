import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar';
import { CreateCalendar } from '@domain/calendar/application/useCases/create-calendar';
import { AddRowInCalendarCommandHandler } from '@infra/crqs/calendar/commands/add-row-in-calendar.command';
import { CreateCalendarCommandHandler } from '@infra/crqs/calendar/commands/create-calendar-command';
import { FetchUserCalendarWithRowsQueryHandler } from '@infra/crqs/calendar/queries/fetch-user-calendar-with-rows.query';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCalendarOnNewUserHandler } from '@infra/crqs/calendar/handlers/create-calendar-on-new-user.handler';

const CommandHandlers = [CreateCalendarCommandHandler, AddRowInCalendarCommandHandler];

const QueryHandlers = [FetchUserCalendarWithRowsQueryHandler];

const EventHandlers = [CreateCalendarOnNewUserHandler];

@Module({
  imports: [CqrsModule.forRoot()],
  providers: [CreateCalendar, AddWorkInCalendar, ...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class CalendarModule {}
