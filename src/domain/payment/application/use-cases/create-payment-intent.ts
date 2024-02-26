import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { SubscribeUserToPayment } from '@domain/auth/application/useCases/subscribe-user';
import { Injectable } from '@nestjs/common';

interface CreatePaymentIntentRequest {
  userId: string;
}

export type CreatePaymentIntentResponse = Either<Error, { paymentSessionId: string }>;

@Injectable()
export class CreatePaymentIntent
  implements UseCaseImplementation<CreatePaymentIntentRequest, CreatePaymentIntentResponse>
{
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly subscribeUser: SubscribeUserToPayment,
  ) {}

  async execute({ userId }: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
    const results = await this.findUserById.execute({ id: userId });

    if (results.isLeft()) return left(results.value);

    const { user } = results.value;

    if (!user.paymentSubscriptionId) {
      const { customerId } = await this.paymentGateway.registerCustomer(user);

      user.paymentSubscriptionId = customerId;

      const subscriberUserResponse = await this.subscribeUser.execute({
        paymentSubscriptionId: customerId,
        userId: user.id,
      });

      if (subscriberUserResponse.isLeft()) {
        return left(new Error('Error on subscribe user'));
      }
    }

    const { paymentSessionId } = await this.paymentGateway.createPaymentIntent(user.paymentSubscriptionId);

    return right({
      paymentSessionId,
    });
  }
}
