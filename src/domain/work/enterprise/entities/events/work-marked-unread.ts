import { DomainEvent } from '@core/entities/entity';
import { Work } from '../work';

export class WorkMarkUnreadEvent implements DomainEvent {
  eventName: string;
  payload: Work;

  constructor(payload: Work) {
    this.eventName = WorkMarkUnreadEvent.name;
    this.payload = payload;
  }
}
