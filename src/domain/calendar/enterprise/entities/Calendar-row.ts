import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Replace } from '@core/replaced';

export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarRowProps {
  calendarId: string;
  workId: string;
  createdAt: Date;
  updatedAt: Date | null;
  dayOfWeek: DaysOfWeek;
}

export type ReplacedCalendarRowProps = Replace<
  CalendarRowProps,
  {
    createdAt?: Date;
    updatedAt?: Date | null;
  }
>;

export class CalendarRow extends Entity<CalendarRowProps> {
  private constructor(props: ReplacedCalendarRowProps, id?: UniqueEntityID) {
    props.createdAt = props.createdAt ?? new Date();
    props.updatedAt = props.updatedAt ?? null;

    super(props as CalendarRowProps, id);
  }

  static create(props: ReplacedCalendarRowProps, id?: UniqueEntityID): CalendarRow {
    return new CalendarRow(props, id);
  }

  get workId() {
    return this.props.workId;
  }

  get calendarId() {
    return this.props.calendarId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get dayOfWeek() {
    return this.props.dayOfWeek;
  }
}
