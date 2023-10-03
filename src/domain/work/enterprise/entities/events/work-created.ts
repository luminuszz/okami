import { DomainEvent } from '@core/entities/entity';
import { Work } from '@domain/work/enterprise/entities/work';

export class WorkCreatedEvent implements DomainEvent<Work> {
  eventName: string;
  payload: Work;

  constructor(payload: Work) {
    this.payload = payload;
    this.eventName = WorkCreatedEvent.name;
  }
}
