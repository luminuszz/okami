import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { PaymentSubscriptionStatus, UserRole } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';

interface UpdatePaymentSubscriptionRequest {
  paymentSubscriptionId: string;
  paymentSubscriberId: string;
  subscriptionStatus: PaymentSubscriptionStatus;
}

type UpdatePaymentSubscriptionResponse = Either<UserNotFound, void>;

@Injectable()
export class UpdatePaymentSubscription
  implements UseCaseImplementation<UpdatePaymentSubscriptionRequest, UpdatePaymentSubscriptionResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    paymentSubscriptionId,
    subscriptionStatus,
    paymentSubscriberId,
  }: UpdatePaymentSubscriptionRequest): Promise<UpdatePaymentSubscriptionResponse> {
    const userOrNull = await this.userRepository.findUserByPaymentSubscriberId(paymentSubscriberId);

    if (!userOrNull) return left(new UserNotFound());

    userOrNull.paymentSubscriptionId = paymentSubscriptionId;
    userOrNull.paymentSubscriptionStatus = subscriptionStatus;

    const roleActionsMap = {
      [PaymentSubscriptionStatus.ACTIVE]: UserRole.SUBSCRIBED_USER,
      [PaymentSubscriptionStatus.INACTIVE]: UserRole.USER,
    };

    userOrNull.role = roleActionsMap[subscriptionStatus];

    await this.userRepository.save(userOrNull);

    return right(null);
  }
}
