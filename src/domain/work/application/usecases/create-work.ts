import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { InvalidWorkOperationError } from './errors/invalid-work-operation';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { PaymentSubscriptionStatus } from '@domain/auth/enterprise/entities/User';

export interface CreateWorkInput {
  name: string;
  chapter: number;
  url: string;
  category: Category;
  image?: {
    imageFile: ArrayBuffer;
    imageType: string;
  };
  userId: string;
}

type CreateWorkOutput = Either<UserNotFound | InvalidWorkOperationError, { work: Work }>;

@Injectable()
export class CreateWorkUseCase implements UseCaseImplementation<CreateWorkInput, CreateWorkOutput> {
  constructor(
    private readonly workRepository: WorkRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ category, chapter, name, url, userId }: CreateWorkInput): Promise<CreateWorkOutput> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFound());
    }

    const canCreateWork = user.paymentSubscriptionStatus === PaymentSubscriptionStatus.ACTIVE || user.hasTrial;

    if (!canCreateWork) {
      return left(new InvalidWorkOperationError('User has no trial quote'));
    }

    const work = Work.create({
      category,
      chapter: new Chapter(chapter),
      nextChapter: new Chapter(null),
      hasNewChapter: false,
      name,
      url,
      createdAt: new Date(),
      userId,
    });

    await this.workRepository.create(work);

    return right({ work });
  }
}
