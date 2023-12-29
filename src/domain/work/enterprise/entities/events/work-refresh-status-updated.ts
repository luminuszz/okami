import { DomainEvent } from '@core/entities/entity';
import { Work } from '@domain/work/enterprise/entities/work';

export class WorkRefreshStatusUpdatedEvent implements DomainEvent<Work> {
  eventName: string;
  payload: Work;

  constructor(payload: Work) {
    this.eventName = WorkRefreshStatusUpdatedEvent.name;
    this.payload = payload;
  }
}
