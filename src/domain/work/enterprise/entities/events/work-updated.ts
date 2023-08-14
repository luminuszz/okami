import { DomainEvent } from '@core/entities/entity';
import { Work } from '@domain/work/enterprise/entities/work';

export class WorkUpdatedEvent implements DomainEvent<Work> {
  eventName: string;

  constructor(public readonly payload: Work) {
    this.eventName = this.constructor.name;
  }
}
