import { UseCaseImplementation } from '@core/use-case';
import { Either, left } from '@core/either';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';

interface SubscribeToWorkUseCaseInput {
  workId: string;
  subscriberId: string;
}

type SubscribeToWorkUseCaseOutput = Either<WorkNotFoundError | UserNotFound, void>;

@Injectable()
export class SubscribeToWorkUseCase
  implements UseCaseImplementation<SubscribeToWorkUseCaseInput, SubscribeToWorkUseCaseOutput>
{
  constructor(private workRepository: WorkRepository, private userRepository: UserRepository) {}

  async execute({ workId, subscriberId }: SubscribeToWorkUseCaseInput): Promise<SubscribeToWorkUseCaseOutput> {
    const workOrUndefined = await this.workRepository.findById(workId);

    if (!workOrUndefined) return left(new WorkNotFoundError());

    const subscriberOrUndefined = await this.userRepository.findById(subscriberId);

    if (!subscriberOrUndefined) return left(new UserNotFound());

    workOrUndefined.addSubscriber(subscriberOrUndefined);
  }
}
