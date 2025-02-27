import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository'
import { Calendar } from '@domain/calendar/enterprise/entities/Calendar'
import { CalendarRow } from '@domain/calendar/enterprise/entities/Calendar-row'
import { filter, find } from 'lodash'

export class InMemoryCalendarRepository implements CalendarRepository {
  public calendars: Calendar[] = []

  async create(calendar: Calendar): Promise<void> {
    this.calendars.push(calendar)
  }

  async findByCalendarByUserId(userId: string): Promise<Calendar | null> {
    return find(this.calendars, (item) => item.userId === userId) ?? null
  }

  async createRow(row: CalendarRow): Promise<void> {
    const index = this.calendars.findIndex((item) => item.id === row.calendarId)

    this.calendars[index].rows.push(row)
  }

  async findCalendarById(calendarId: string): Promise<Calendar | null> {
    return find(this.calendars, (item) => item.id === calendarId) ?? null
  }

  async fetchRowsByCalendarIdAndDayOfWeek(calendarId: string, dayOfWeek: number): Promise<CalendarRow[]> {
    const calendar = find(this.calendars, (item) => item.id === calendarId)

    if (!calendar) {
      return null
    }

    return filter(calendar.rows, (row) => row.dayOfWeek === dayOfWeek) ?? []
  }

  async deleteRow(rowId: string): Promise<void> {
    this.calendars.forEach((calendar) => {
      calendar.rows = filter(calendar.rows, (row) => row.id !== rowId)
    })
  }

  async findCalendarRowById(calendarId: string, rowId: string): Promise<CalendarRow | null> {
    return find(this.calendars, (item) => item.id === calendarId)?.rows.find((row) => row.id === rowId) ?? null
  }
}
