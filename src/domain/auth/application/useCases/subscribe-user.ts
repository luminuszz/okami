import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '../errors/UserNotFound';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';

interface SubscribeUserRequest {
  userId: string;
  paymentSubscriptionId: string;
}

type SubscribeUserResponse = Either<UserNotFound, void>;

@Injectable()
export class SubscribeUserToPayment implements UseCaseImplementation<SubscribeUserRequest, SubscribeUserResponse> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId, paymentSubscriptionId }: SubscribeUserRequest): Promise<SubscribeUserResponse> {
    const user = await this.userRepository.findById(userId);

    user.paymentSubscriptionId = paymentSubscriptionId;

    await this.userRepository.save(user);

    if (!user) return left(new UserNotFound());

    return right(null);
  }
}
