import { User } from '@domain/auth/enterprise/entities/User';

export abstract class UserRepository {
  create: (user: User) => Promise<void>;
  findByEmail: (email: string) => Promise<User | undefined>;
  findById: (id: string) => Promise<User | undefined>;
  save: (user: User) => Promise<void>;
  findUserByPaymentSubscriptionId: (paymentSubscriptionId: string) => Promise<User | undefined>;
  findUserByPaymentSubscriberId: (paymentSubscriberId: string) => Promise<User | undefined>;
}
