import { UseCaseImplementation } from '@core/use-case';
import { Either, right } from '@core/either';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation';
import { CalendarRow, DaysOfWeek } from '@domain/calendar/enterprise/entities/calendar-row';
import { Injectable } from '@nestjs/common';
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';

export interface AddWorkInCalendarInput {
  workId: string;
  calendarId: string;
  dayOfWeek: DaysOfWeek;
}

export type AddWorkInCalendarOutput = Either<ResourceNotFound | InvalidCalendarOperation, { row: CalendarRow }>;

@Injectable()
export class AddWorkInCalendar implements UseCaseImplementation<AddWorkInCalendarInput, AddWorkInCalendarOutput> {
  constructor(private readonly calendarRepository: CalendarRepository) {}

  async execute({ workId, calendarId, dayOfWeek }: AddWorkInCalendarInput): Promise<AddWorkInCalendarOutput> {
    const row = CalendarRow.create({
      calendarId,
      workId,
      dayOfWeek,
      createdAt: new Date(),
      updatedAt: null,
    });

    await this.calendarRepository.createRow(row);

    return right({
      row,
    });
  }
}
