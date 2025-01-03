import { ResourceNotFound } from '@core/errors/resource-not-found';
import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar';
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation';
import { Calendar } from '@domain/calendar/enterprise/entities/Calendar';
import { DaysOfWeek } from '@domain/calendar/enterprise/entities/Calendar-row';
import { faker } from '@faker-js/faker';
import { InMemoryCalendarRepository } from '@test/mocks/in-memory-calendar-repository';
import { InMemoryWorkRepository } from '@test/mocks/in-mermory-work-repository';
import { createWorkPropsFactory } from '@test/mocks/mocks';
import { Work } from '@domain/work/enterprise/entities/work';

describe('AddWorkInCalendar', () => {
  let stu: AddWorkInCalendar;
  let workRepository: InMemoryWorkRepository;
  let calendarRepository: InMemoryCalendarRepository;

  beforeEach(() => {
    calendarRepository = new InMemoryCalendarRepository();
    workRepository = new InMemoryWorkRepository();
    stu = new AddWorkInCalendar(calendarRepository, workRepository);
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

    const work = Work.create(createWorkPropsFactory({ userId }));

    await workRepository.create(work);

    const results = await stu.execute({
      workId: work.id,
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
      userId: userId,
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    const work = Work.create(createWorkPropsFactory({ userId }));

    await workRepository.create(work);
    await calendarRepository.create(calendar);

    const { id: SAME_WORK_ID } = work;

    const MONDAY_DAY_OF_WEEK = 1;

    await stu.execute({
      workId: SAME_WORK_ID,
      dayOfWeek: MONDAY_DAY_OF_WEEK,
      userId,
    });

    const results = await stu.execute({
      workId: SAME_WORK_ID,
      dayOfWeek: MONDAY_DAY_OF_WEEK,
      userId,
    });

    expect(results.isLeft()).toBeTruthy();
    expect(results.value).toBeInstanceOf(InvalidCalendarOperation);
  });
});
