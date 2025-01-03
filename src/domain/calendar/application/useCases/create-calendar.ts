import { Either, left, right } from '@core/either';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { Calendar } from '@domain/calendar/enterprise/entities/Calendar';
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation';

export interface CreateCalendarInput {
  userId: string;
  title: string;
  description: string;
}

export type CreateCalendarOutput = Either<ResourceNotFound | InvalidCalendarOperation, { calendar: Calendar }>;

@Injectable()
export class CreateCalendar implements UseCaseImplementation<CreateCalendarInput, CreateCalendarOutput> {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ title, userId, description }: CreateCalendarInput): Promise<CreateCalendarOutput> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      return left(new ResourceNotFound('User not found'));
    }

    const userAlreadyHasCalendar = await this.calendarRepository.findByCalendarByUserId(userExists.id);

    if (userAlreadyHasCalendar) {
      return left(new InvalidCalendarOperation('Calendar Duplicate'));
    }

    const calendar = Calendar.create({
      title,
      userId,
      description,
      createdAt: new Date(),
    });

    await this.calendarRepository.create(calendar);

    return right({
      calendar,
    });
  }
}
