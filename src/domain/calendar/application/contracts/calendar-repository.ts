import { Calendar } from '@domain/calendar/enterprise/entities/calendar';
import { CalendarRow } from '@domain/calendar/enterprise/entities/calendar-row';

export abstract class CalendarRepository {
  abstract create(calendar: Calendar): Promise<void>;
  abstract findByCalendarByUserId(userId: string): Promise<Calendar | null>;
  abstract createRow(row: CalendarRow): Promise<void>;
}
