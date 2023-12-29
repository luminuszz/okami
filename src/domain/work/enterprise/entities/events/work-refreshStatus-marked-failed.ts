import { DomainEvent } from '@core/entities/entity';
import { Work } from '@domain/work/enterprise/entities/work';

export class WorkRefreshStatusMarkedFailedEvent implements DomainEvent<Work> {
  eventName: string;
  payload: Work;

  constructor(payload: Work) {
    this.eventName = WorkRefreshStatusMarkedFailedEvent.name;
    this.payload = payload;
  }
}
