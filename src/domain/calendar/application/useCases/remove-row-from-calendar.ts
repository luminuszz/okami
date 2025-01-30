import { Either, left, right } from '@core/either'
import { ResourceNotFound } from '@core/errors/resource-not-found'
import { UseCaseImplementation } from '@core/use-case'
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository'
import { Injectable } from '@nestjs/common'

export interface RemoveWorkFromCalendarDayInput {
  rowId: string
  userId: string
}

export type RemoveWorkFromCalendarDayOutput = Either<ResourceNotFound, void>

@Injectable()
export class RemoveRowFromCalendar
  implements UseCaseImplementation<RemoveWorkFromCalendarDayInput, RemoveWorkFromCalendarDayOutput>
{
  constructor(private readonly calendarRepository: CalendarRepository) {}

  async execute({ rowId, userId }: RemoveWorkFromCalendarDayInput): Promise<RemoveWorkFromCalendarDayOutput> {
    const userCalendar = await this.calendarRepository.findByCalendarByUserId(userId)

    if (!userCalendar) {
      return left(new ResourceNotFound('User calendar not found'))
    }

    const row = await this.calendarRepository.findCalendarRowById(userCalendar.id, rowId)

    if (!row) {
      return left(new ResourceNotFound('Row not found'))
    }

    await this.calendarRepository.deleteRow(rowId)

    return right(null)
  }
}
