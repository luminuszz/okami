import { FetchUserCalendarWithRowsQuery } from '@app/infra/crqs/calendar/queries/fetch-user-calendar-with-rows.query'
import { AddRowInCalendarCommand } from '@infra/crqs/calendar/commands/add-row-in-calendar.command'
import { CreateCalendarCommand } from '@infra/crqs/calendar/commands/create-calendar-command'
import { RemoveRowFromCalendarCommand } from '@infra/crqs/calendar/commands/remove-row-from-calendar.command'
import { User } from '@infra/http/user-auth.decorator'
import { AddRowInCalendarDto } from '@infra/http/validators/add-row-in-calendar.dto'
import { CreateCalendarDto } from '@infra/http/validators/create-calendar-dto'
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CalendarHttpModelValidator, CalendarModel } from '../models/calendar.model'

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('')
  @ApiResponse({ type: CalendarModel })
  async fetchUserCalendar(@User('id') userId: string) {
    const results = await this.queryBus.execute(new FetchUserCalendarWithRowsQuery(userId))

    return CalendarHttpModelValidator.validate(results)
  }

  @Post('/')
  async create(@Body() body: CreateCalendarDto, @User('id') userId: string) {
    console.log('userId', userId)

    await this.commandBus.execute(new CreateCalendarCommand(userId, body.title, body.description))
  }

  @Post('/row')
  async addRowInCalendar(@Body() { dayOfWeek, workId }: AddRowInCalendarDto, @User('id') userId: string) {
    await this.commandBus.execute(new AddRowInCalendarCommand(workId, dayOfWeek, userId))
  }

  @Delete('/row/:rowId')
  async removeRowFromCalendar(@Param('rowId', ParseObjectIdPipe) rowId: string, @User('id') userId: string) {
    await this.commandBus.execute(new RemoveRowFromCalendarCommand(rowId, userId))
  }
}
