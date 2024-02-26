import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { UserNotFound } from '../errors/UserNotFound';
import { UserRepository } from './repositories/user-repository';
import { PaymentSubscriptionStatus } from '@domain/auth/enterprise/entities/User';

interface CheckUserSubscriptionStatusRequest {
  userId: string;
}

type CheckUserSubscriptionStatusResponse = Either<UserNotFound, { isChecked: boolean }>;

@Injectable()
export class CheckUserSubscriptionStatus
  implements UseCaseImplementation<CheckUserSubscriptionStatusRequest, CheckUserSubscriptionStatusResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: CheckUserSubscriptionStatusRequest): Promise<CheckUserSubscriptionStatusResponse> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      return left(new UserNotFound());
    }

    const subscriptionIsActive =
      userExists.paymentSubscriptionStatus === PaymentSubscriptionStatus.ACTIVE && !!userExists.paymentSubscriptionId;

    return right({
      isChecked: subscriptionIsActive,
    });
  }
}
