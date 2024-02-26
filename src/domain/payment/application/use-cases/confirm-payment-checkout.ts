import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { Injectable } from '@nestjs/common';

interface ConfirmPaymentCheckoutRequest {
  userId: string;
  paymentSubscriberId: string;
  paymentSubscriptionId: string;
}

type ConfirmPaymentCheckoutResponse = Either<UserNotFound, void>;

@Injectable()
export class ConfirmPaymentCheckout
  implements UseCaseImplementation<ConfirmPaymentCheckoutRequest, ConfirmPaymentCheckoutResponse>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  async execute({
    userId,
    paymentSubscriberId,
    paymentSubscriptionId,
  }: ConfirmPaymentCheckoutRequest): Promise<ConfirmPaymentCheckoutResponse> {
    const existsUser = await this.findUserByIdUseCase.execute({ id: userId });

    if (existsUser.isLeft()) throw existsUser.value;

    const { user } = existsUser.value;

    user.paymentSubscriberId = paymentSubscriberId;
    user.paymentSubscriptionId = paymentSubscriptionId;

    await this.userRepository.save(user);

    return right(null);
  }
}
