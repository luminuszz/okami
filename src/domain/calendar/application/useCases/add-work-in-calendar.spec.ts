import { ResourceNotFound } from '@core/errors/resource-not-found';
import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar';
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation';
import { Calendar } from '@domain/calendar/enterprise/entities/calendar';
import { DaysOfWeek } from '@domain/calendar/enterprise/entities/calendar-row';
import { faker } from '@faker-js/faker';
import { InMemoryCalendarRepository } from '@test/mocks/in-memory-calendar-repository';

describe('AddWorkInCalendar', () => {
  let stu: AddWorkInCalendar;
  let calendarRepository: InMemoryCalendarRepository;

  beforeEach(() => {
    calendarRepository = new InMemoryCalendarRepository();
    stu = new AddWorkInCalendar(calendarRepository);
  });

  it('should be able to add row in calendar', async () => {
    const userId = faker.string.uuid();

    const calendar = Calendar.create({
      rows: [],
      userId: userId,
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    await calendarRepository.create(calendar);

    const results = await stu.execute({
      calendarId: calendar.id,
      workId: faker.string.uuid(),
      dayOfWeek: faker.helpers.rangeToNumber({ min: 1, max: 6 }) as DaysOfWeek,
      userId,
    });

    console.log(calendarRepository.calendars);

    expect(results.isRight()).toBeTruthy();

    expect(calendarRepository.calendars[0].rows).toHaveLength(1);
  });

  it('should not be able to add row in calendar if calendar not exists', async () => {
    const userId = faker.string.uuid();

    const results = await stu.execute({
      calendarId: faker.string.uuid(),
      workId: faker.string.uuid(),
      dayOfWeek: faker.helpers.rangeToNumber({ min: 1, max: 6 }) as DaysOfWeek,
      userId,
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(ResourceNotFound);
  });

  it('should not be able to add row in calendar if work already added in calendar in same day of week', async () => {
    const userId = faker.string.uuid();

    const calendar = Calendar.create({
      rows: [],
      userId: faker.string.uuid(),
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    await calendarRepository.create(calendar);

    const MONDAY_DAY_OF_WEEK = 1;

    const SAME_WORK_ID = faker.string.uuid();

    await stu.execute({
      calendarId: calendar.id,
      workId: SAME_WORK_ID,
      dayOfWeek: MONDAY_DAY_OF_WEEK,
      userId,
    });

    const results = await stu.execute({
      calendarId: calendar.id,
      workId: SAME_WORK_ID,
      dayOfWeek: MONDAY_DAY_OF_WEEK,
      userId,
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidCalendarOperation);
  });

  it('should not be able to add row in calendar if user not be a calendar owner', async () => {
    const calendar = Calendar.create({
      rows: [],
      userId: faker.string.uuid(),
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    await calendarRepository.create(calendar);

    const FAKER_USER_ID = faker.string.uuid();

    const results = await stu.execute({
      calendarId: calendar.id,
      workId: faker.string.uuid(),
      dayOfWeek: 1,
      userId: FAKER_USER_ID,
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidCalendarOperation);
  });
});
