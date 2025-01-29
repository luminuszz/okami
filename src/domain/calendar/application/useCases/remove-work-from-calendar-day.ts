import { Either, left, right } from '@core/either'
import { ResourceNotFound } from '@core/errors/resource-not-found'
import { UseCaseImplementation } from '@core/use-case'
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository'
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation'
import { Injectable } from '@nestjs/common'

export interface RemoveWorkFromCalendarDayInput {
  dayOfWeek: number
  workId: string
  calendarId: string
  userId: string
}

export type RemoveWorkFromCalendarDayOutput = Either<ResourceNotFound, void>

@Injectable()
export class RemoveWorkFromCalendarDay
  implements UseCaseImplementation<RemoveWorkFromCalendarDayInput, RemoveWorkFromCalendarDayOutput>
{
  constructor(private readonly calendarRepository: CalendarRepository) {}

  async execute({
    calendarId,
    workId,
    dayOfWeek,
    userId,
  }: RemoveWorkFromCalendarDayInput): Promise<RemoveWorkFromCalendarDayOutput> {
    const calendar = await this.calendarRepository.findCalendarById(calendarId)

    if (!calendar) {
      return left(new ResourceNotFound('Calendar not found'))
    }

    const userIsCalendarOwner = calendar.userId === userId

    if (!userIsCalendarOwner) {
      return left(new InvalidCalendarOperation('User is not the owner of the calendar'))
    }

    const rows = await this.calendarRepository.fetchRowsByCalendarIdAndDayOfWeek(calendarId, dayOfWeek)

    const row = rows.find((row) => row.workId === workId)

    if (row) {
      await this.calendarRepository.removeRow(row.id)
    }

    return right(null)
  }
}
