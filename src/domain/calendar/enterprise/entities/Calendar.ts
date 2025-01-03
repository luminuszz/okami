import { Entity } from '@core/entities/entity';
import { Replace } from '@core/replaced';
import { CalendarRow } from '@domain/calendar/enterprise/entities/Calendar-row';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export interface CalendarProps {
  userId: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date | null;
  rows: CalendarRow[];
}

export type CalendarReplacedProps = Replace<
  CalendarProps,
  {
    createdAt?: Date;
    updatedAt?: Date | null;
    rows?: CalendarRow[];
  }
>;

export class Calendar extends Entity<CalendarProps> {
  private constructor(props: CalendarReplacedProps, id?: UniqueEntityID) {
    props.createdAt = props.createdAt ?? new Date();
    props.updatedAt = props.updatedAt ?? null;
    props.description = props.description ?? '';
    props.rows = props.rows ?? [];

    super(props as CalendarProps, id);
  }

  static create(props: CalendarReplacedProps, id?: UniqueEntityID): Calendar {
    return new Calendar(props, id);
  }

  get userId() {
    return this.props.userId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get rows() {
    return this.props.rows;
  }
}
