import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';
import { Calendar } from '@domain/calendar/enterprise/entities/calendar';
import { CalendarRow } from '@domain/calendar/enterprise/entities/calendar-row';
import { filter, find } from 'lodash';

export class InMemoryCalendarRepository implements CalendarRepository {
  public calendars: Calendar[] = [];

  async create(calendar: Calendar): Promise<void> {
    this.calendars.push(calendar);
  }

  async findByCalendarByUserId(userId: string): Promise<Calendar | null> {
    return find(this.calendars, (item) => item.userId === userId) ?? null;
  }

  async createRow(row: CalendarRow): Promise<void> {
    const index = this.calendars.findIndex((item) => item.id === row.calendarId);

    this.calendars[index].rows.push(row);
  }

  async findCalendarById(calendarId: string): Promise<Calendar | null> {
    return find(this.calendars, (item) => item.id === calendarId) ?? null;
  }

  async fetchRowsByCalendarIdAndDayOfWeek(calendarId: string, dayOfWeek: number): Promise<CalendarRow[]> {
    const calendar = find(this.calendars, (item) => item.id === calendarId);

    if (!calendar) {
      return null;
    }

    return filter(calendar.rows, (row) => row.dayOfWeek === dayOfWeek) ?? [];
  }
}
