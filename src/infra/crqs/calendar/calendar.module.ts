import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCalendarCommandHandler } from '@infra/crqs/calendar/commands/create-calendar-command';
import { AddRowInCalendarCommandHandler } from '@infra/crqs/calendar/commands/add-row-in-calendar.command';
import { CreateCalendar } from '@domain/calendar/application/useCases/create-calendar';
import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar';

const CommandHandlers = [CreateCalendarCommandHandler, AddRowInCalendarCommandHandler];

const QueryHandlers = [];

@Module({
  imports: [CqrsModule.forRoot()],
  providers: [CreateCalendar, AddWorkInCalendar, ...CommandHandlers, ...QueryHandlers],
})
export class CalendarModule {}
