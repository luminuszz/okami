import { DomainEvent } from '@core/entities/entity';
import { User } from '../entities/User';

export class UserEmailUpdated implements DomainEvent<User> {
  eventName: string;

  constructor(public readonly payload: User) {
    this.eventName = UserEmailUpdated.name;
  }
}
