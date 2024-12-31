import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateCalendarDto } from '@infra/http/validators/create-calendar-dto';
import { User } from '@infra/http/user-auth.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCalendarCommand } from '@infra/crqs/calendar/commands/create-calendar-command';
import { AddRowInCalendarDto } from '@infra/http/validators/addRowInCalendar.dto';
import { AddRowInCalendarCommand } from '@infra/crqs/calendar/commands/add-row-in-calendar.command';

@Controller('calendar')
export class CalendarController {
  constructor(private commandBus: CommandBus) {}

  @Post('/')
  async create(@Body() body: CreateCalendarDto, @User('id') userId: string) {
    console.log('userId', userId);

    await this.commandBus.execute(new CreateCalendarCommand(userId, body.title, body.description));
  }

  @Post('/:calendarId/row')
  async addRowInCalendar(@Body() { dayOfWeek, workId }: AddRowInCalendarDto, @Param('calendarId') calendarId: string) {
    await this.commandBus.execute(new AddRowInCalendarCommand(workId, calendarId, dayOfWeek));
  }
}
