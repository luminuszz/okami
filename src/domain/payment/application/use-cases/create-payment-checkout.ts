import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { PaymentGateway } from '@domain/auth/application/contracts/payment-gateway';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { Injectable } from '@nestjs/common';

interface CreatePaymentCheckoutRequest {
  userId: string;
}

export type CreatePaymentCheckoutResponse = Either<Error, { paymentSessionId: string }>;

@Injectable()
export class CreatePaymentCheckout
  implements UseCaseImplementation<CreatePaymentCheckoutRequest, CreatePaymentCheckoutResponse>
{
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly useRepository: UserRepository,
  ) {}

  async execute({ userId }: CreatePaymentCheckoutRequest): Promise<CreatePaymentCheckoutResponse> {
    const userExists = await this.findUserById.execute({ id: userId });

    if (userExists.isLeft()) {
      return left(userExists.value);
    }

    const { user } = userExists.value;

    if (!user.paymentSubscriberId) {
      const { customerId } = await this.paymentGateway.registerCustomer(user);

      user.paymentSubscriberId = customerId;

      await this.useRepository.save(user);
    }

    const { paymentSessionId } = await this.paymentGateway.createPaymentIntent(user);

    return right({
      paymentSessionId,
    });
  }
}
