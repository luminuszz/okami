import { DomainEvent } from '@core/entities/entity';
import { User } from '@domain/auth/enterprise/entities/User';

export class UserCreated implements DomainEvent<User> {
  eventName: string;
  payload: User;

  constructor(user: User) {
    this.eventName = UserCreated.name;
    this.payload = user;
  }
}
