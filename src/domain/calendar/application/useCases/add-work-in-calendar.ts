import { Either, left, right } from '@core/either';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { UseCaseImplementation } from '@core/use-case';
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation';
import { CalendarRow, DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row';
import { Injectable } from '@nestjs/common';

export interface AddWorkInCalendarInput {
  workId: string;
  calendarId: string;
  dayOfWeek: DaysOfWeek;
  userId: string;
}

export type AddWorkInCalendarOutput = Either<ResourceNotFound | InvalidCalendarOperation, { row: CalendarRow }>;

@Injectable()
export class AddWorkInCalendar implements UseCaseImplementation<AddWorkInCalendarInput, AddWorkInCalendarOutput> {
  constructor(private readonly calendarRepository: CalendarRepository) {}

  async execute({ workId, calendarId, dayOfWeek, userId }: AddWorkInCalendarInput): Promise<AddWorkInCalendarOutput> {
    const existsCalendar = await this.calendarRepository.findCalendarById(calendarId);

    if (!existsCalendar) {
      return left(new ResourceNotFound('Calendar not found'));
    }

    const isCalendarOwner = existsCalendar.userId === userId;

    if (!isCalendarOwner) {
      return left(new InvalidCalendarOperation('User is not the owner of the calendar'));
    }

    const row = CalendarRow.create({
      calendarId,
      workId,
      dayOfWeek,
      createdAt: new Date(),
      updatedAt: null,
    });

    const worksInSameDayOfWeek = await this.calendarRepository.fetchRowsByCalendarIdAndDayOfWeek(calendarId, dayOfWeek);

    const alreadyExistsRowWithSameWorkInSameDayOfWeek = worksInSameDayOfWeek.some((row) => row.workId === workId);

    if (alreadyExistsRowWithSameWorkInSameDayOfWeek) {
      return left(new InvalidCalendarOperation('Work already added in calendar in same day of week'));
    }

    await this.calendarRepository.createRow(row);

    return right({
      row,
    });
  }
}
