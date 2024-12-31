import { AddWorkInCalendar } from '@domain/calendar/application/useCases/add-work-in-calendar';
import { InMemoryCalendarRepository } from '@test/mocks/in-memory-calendar-repository';
import { Calendar } from '@domain/calendar/enterprise/entities/calendar';
import { faker } from '@faker-js/faker';
import { DaysOfWeek } from '@domain/calendar/enterprise/entities/calendar-row';

describe('AddWorkInCalendar', () => {
  let stu: AddWorkInCalendar;
  let calendarRepository: InMemoryCalendarRepository;

  beforeEach(() => {
    calendarRepository = new InMemoryCalendarRepository();
    stu = new AddWorkInCalendar(calendarRepository);
  });

  it('should be able to add row in calendar', async () => {
    const calendar = Calendar.create({
      rows: [],
      userId: faker.string.uuid(),
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    await calendarRepository.create(calendar);

    const results = await stu.execute({
      calendarId: calendar.id,
      workId: faker.string.uuid(),
      dayOfWeek: faker.helpers.rangeToNumber({ min: 1, max: 6 }) as DaysOfWeek,
    });

    expect(results.isRight()).toBeTruthy();

    expect(calendarRepository.calendars[0].rows).toHaveLength(1);
  });
});
