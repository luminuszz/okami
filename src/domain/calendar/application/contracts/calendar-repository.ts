import { Calendar } from '@domain/calendar/enterprise/entities/Calendar';
import { CalendarRow } from '@domain/calendar/enterprise/entities/Calendar-row';

export abstract class CalendarRepository {
  abstract create(calendar: Calendar): Promise<void>;
  abstract findByCalendarByUserId(userId: string): Promise<Calendar | null>;
  abstract createRow(row: CalendarRow): Promise<void>;
  abstract findCalendarById(calendarId: string): Promise<Calendar | null>;
  abstract fetchRowsByCalendarIdAndDayOfWeek(calendarId: string, dayOfWeek: number): Promise<CalendarRow[] | null>;
}
