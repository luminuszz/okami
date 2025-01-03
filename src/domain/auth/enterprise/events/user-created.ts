import { DomainEvent } from '@core/entities/entity';
import { User } from '@domain/auth/enterprise/entities/User';

export class UserCreated implements DomainEvent<User> {
  eventName: string;

  constructor(public readonly payload: User) {
    this.eventName = UserCreated.name;
  }
}
