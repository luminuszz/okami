import { CreateCalendar } from '@domain/calendar/application/useCases/create-calendar';
import { faker } from '@faker-js/faker';
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository';
import { InMemoryCalendarRepository } from '@test/mocks/in-memory-calendar-repository';
import { createUserPropsFactory } from '@test/mocks/mocks';
import { User } from '@domain/auth/enterprise/entities/User';
import { ResourceNotFound } from '@core/errors/resource-not-found';

describe('CreateCalendar', () => {
  let stu: CreateCalendar;

  let userRepository: InMemoryUserRepository;
  let calendarRepository: InMemoryCalendarRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    calendarRepository = new InMemoryCalendarRepository();
    stu = new CreateCalendar(calendarRepository, userRepository);
  });

  it('should be able to create a calendar', async () => {
    const user = User.create(createUserPropsFactory());

    await userRepository.create(user);

    const result = await stu.execute({
      userId: user.id,
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    if (result.isRight()) {
      expect(result.value.calendar).toBeDefined();
    }

    console.log(result.value);

    expect(calendarRepository.calendars).toHaveLength(1);
    expect(result.isRight()).toBeTruthy();
  });

  it('should not be able to create a calendar if user not found', async () => {
    const user = User.create(createUserPropsFactory());

    await userRepository.create(user);

    const FAKER_USER_ID = faker.string.uuid();

    const result = await stu.execute({
      userId: FAKER_USER_ID,
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFound);
  });

  it('it not should be able to create a new calendar if user already has calendar', async () => {
    const user = User.create(createUserPropsFactory());

    await userRepository.create(user);

    await stu.execute({
      userId: user.id,
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    const result = await stu.execute({
      userId: user.id,
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
    });

    console.log(calendarRepository.calendars);

    expect(result.isLeft()).toBeTruthy();
  });
});
