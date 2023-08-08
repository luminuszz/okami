import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { User } from '@domain/auth/enterprise/entities/User';

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
