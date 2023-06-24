import { DomainEvent } from '@core/entities/entity';
import { Work } from '@domain/work/enterprise/entities/work';

export class WorkMarkedFinishedEvent implements DomainEvent<Work> {
  eventName: string;
  payload: Work;

  constructor(payload: Work) {
    this.eventName = WorkMarkedFinishedEvent.name;
    this.payload = payload;
  }
}
