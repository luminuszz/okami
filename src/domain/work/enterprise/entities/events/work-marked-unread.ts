import { DomainEvent } from '@core/entities/entity';

interface WorkMarkUnreadEventPayload {
  id: string;
  name: string;
  url: string;
}

export class WorkMarkUnreadEvent implements DomainEvent {
  eventName: string;
  payload: WorkMarkUnreadEventPayload;

  constructor(payload: WorkMarkUnreadEventPayload) {
    this.eventName = WorkMarkUnreadEvent.name;
    this.payload = payload;
  }
}
