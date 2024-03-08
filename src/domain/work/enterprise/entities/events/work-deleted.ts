import { DomainEvent } from '@core/entities/entity';
import { Work } from '../work';

export class WorkDeletedEvent implements DomainEvent<Work> {
  eventName: string;

  constructor(public readonly payload: Work) {
    this.eventName = WorkDeletedEvent.name;
  }
}
