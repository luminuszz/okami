import { ResourceNotFound } from '@core/errors/resource-not-found'
import { User } from '@domain/auth/enterprise/entities/User'
import { InvalidCalendarOperation } from '@domain/calendar/application/useCases/errors/invalid-calendar-operation'
import { RemoveWorkFromCalendarDay } from '@domain/calendar/application/useCases/remove-work-from-calendar-day'
import { Calendar } from '@domain/calendar/enterprise/entities/Calendar'
import { CalendarRow } from '@domain/calendar/enterprise/entities/Calendar-row'
import { faker } from '@faker-js/faker'
import { InMemoryCalendarRepository } from '@test/mocks/in-memory-calendar-repository'
import { InMemoryUserRepository } from '@test/mocks/in-memory-user-repository'
import { createUserPropsFactory } from '@test/mocks/mocks'

describe('RemoveWorkFromCalendarDay', () => {
  let stu: RemoveWorkFromCalendarDay

  let userRepository: InMemoryUserRepository
  let calendarRepository: InMemoryCalendarRepository

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    calendarRepository = new InMemoryCalendarRepository()
    stu = new RemoveWorkFromCalendarDay(calendarRepository)
  })

  it('should be able to remove work from day in calendar', async () => {
    const user = User.create(createUserPropsFactory())

    await userRepository.create(user)

    const calendar = Calendar.create({
      title: faker.lorem.slug(),
      rows: [],
      userId: user.id,
      description: faker.lorem.text(),
    })

    await calendarRepository.create(calendar)

    const calendarRow = CalendarRow.create({
      calendarId: calendar.id,
      dayOfWeek: 1,
      workId: faker.string.uuid(),
    })

    await calendarRepository.createRow(calendarRow)

    const result = await stu.execute({
      userId: user.id,
      workId: calendarRow.workId,
      calendarId: calendar.id,
      dayOfWeek: calendarRow.dayOfWeek,
    })

    expect(result.isRight()).toBeTruthy()
    expect(calendarRepository.calendars[0].rows).toHaveLength(0)
  })

  it(' not should be able to remove work from day in calendar if calendar not exists', async () => {
    const user = User.create(createUserPropsFactory())

    await userRepository.create(user)

    const calendar = Calendar.create({
      title: faker.lorem.slug(),
      rows: [],
      userId: user.id,
      description: faker.lorem.text(),
    })

    await calendarRepository.create(calendar)

    const calendarRow = CalendarRow.create({
      calendarId: calendar.id,
      dayOfWeek: 1,
      workId: faker.string.uuid(),
    })

    await calendarRepository.createRow(calendarRow)

    const FAKE_CALENDAR_ID = faker.string.uuid()

    const result = await stu.execute({
      userId: user.id,
      workId: calendarRow.workId,
      calendarId: FAKE_CALENDAR_ID,
      dayOfWeek: calendarRow.dayOfWeek,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it(' not should be able to remove work from day in calendar if calendar user is not calendar owner', async () => {
    const user = User.create(createUserPropsFactory())

    await userRepository.create(user)

    const calendar = Calendar.create({
      title: faker.lorem.slug(),
      rows: [],
      userId: user.id,
      description: faker.lorem.text(),
    })

    await calendarRepository.create(calendar)

    const calendarRow = CalendarRow.create({
      calendarId: calendar.id,
      dayOfWeek: 1,
      workId: faker.string.uuid(),
    })

    await calendarRepository.createRow(calendarRow)

    const FAKER_USER_ID = faker.string.uuid()

    const result = await stu.execute({
      userId: FAKER_USER_ID,
      workId: calendarRow.workId,
      calendarId: calendar.id,
      dayOfWeek: calendarRow.dayOfWeek,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCalendarOperation)
  })
})
