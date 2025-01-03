import { Either, left, right } from '@core/either';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { UseCaseImplementation } from '@core/use-case';
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation';
import { CalendarRow, DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';

export interface AddWorkInCalendarInput {
  workId: string;
  dayOfWeek: DaysOfWeek;
  userId: string;
}

export type AddWorkInCalendarOutput = Either<ResourceNotFound | InvalidCalendarOperation, { row: CalendarRow }>;

@Injectable()
export class AddWorkInCalendar implements UseCaseImplementation<AddWorkInCalendarInput, AddWorkInCalendarOutput> {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly workRepository: WorkRepository,
  ) {}

  async execute({ workId, dayOfWeek, userId }: AddWorkInCalendarInput): Promise<AddWorkInCalendarOutput> {
    const existsCalendar = await this.calendarRepository.findByCalendarByUserId(userId);

    if (!existsCalendar) {
      return left(new ResourceNotFound('Calendar'));
    }

    const work = await this.workRepository.findById(workId);

    const isWorkOwner = work && work.userId === userId;

    if (!isWorkOwner) {
      return left(new InvalidCalendarOperation('User is not the owner of the work'));
    }

    const worksInSameDayOfWeek = await this.calendarRepository.fetchRowsByCalendarIdAndDayOfWeek(
      existsCalendar.id,
      dayOfWeek,
    );

    const alreadyExistsRowWithSameWorkInSameDayOfWeek = worksInSameDayOfWeek.some((row) => row.workId === workId);

    if (alreadyExistsRowWithSameWorkInSameDayOfWeek) {
      return left(new InvalidCalendarOperation('Work already added in calendar in same day of week'));
    }

    const row = CalendarRow.create({
      calendarId: existsCalendar.id,
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
