import { User } from '@domain/auth/enterprise/entities/User';

export abstract class PaymentGateway {
  abstract createPaymentIntent(user: User): Promise<{ paymentSessionId: string }>;
  abstract registerCustomer(user: User): Promise<{ customerId: string }>;
}
