import { DomainEvent } from '@core/entities/entity';
import { Work } from '../work';

export class WorkMarkReadEvent implements DomainEvent {
  eventName: string;
  payload: Work;

  constructor(payload: Work) {
    this.eventName = WorkMarkReadEvent.name;
    this.payload = payload;
  }
}
