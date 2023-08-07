import { User } from '@domain/auth/enterprise/entities/User';

export abstract class UserRepository {
  create: (user: User) => Promise<void>;
  findByEmail: (email: string) => Promise<User | undefined>;
}
