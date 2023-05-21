import { DomainEvent } from '@core/entities/entity';

interface WorkMarkReadEventPayload {
  id: string;
  name: string;
  url: string;
}

export class WorkMarkReadEvent implements DomainEvent {
  eventName: string;
  payload: WorkMarkReadEventPayload;

  constructor(payload: WorkMarkReadEventPayload) {
    this.eventName = WorkMarkReadEvent.name;
    this.payload = payload;
  }
}
