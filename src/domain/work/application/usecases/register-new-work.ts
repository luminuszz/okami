import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { PaymentSubscriptionStatus } from '@domain/auth/enterprise/entities/User';
import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Category, Work, WorkStatus } from '@domain/work/enterprise/entities/work';
import { Injectable } from '@nestjs/common';
import { WorkRepository } from '../repositories/work-repository';
import { InvalidWorkOperationError } from './errors/invalid-work-operation';
import { UploadWorkImageUseCase } from './upload-work-image';

interface RegisterNewWorkRequest {
  name: string;
  chapter: number;
  url: string;
  category: Category;
  image?: {
    imageFile: ArrayBuffer;
    imageType: string;
  };
  userId: string;
  tagsId?: string[];
}

type RegisterNewWorkResponse = Either<UserNotFound | InvalidWorkOperationError, { work: Work }>;

@Injectable()
export class RegisterNewWork implements UseCaseImplementation<RegisterNewWorkRequest, RegisterNewWorkResponse> {
  constructor(
    private readonly workRepository: WorkRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadWorkImage: UploadWorkImageUseCase,
  ) {}
  async execute({
    category,
    chapter,
    name,
    url,
    userId,
    image,
    tagsId,
  }: RegisterNewWorkRequest): Promise<RegisterNewWorkResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) return left(new UserNotFound());

    const worksCount = await this.workRepository.fetchAllWorksByUserIdCount(user.id);

    const userHaveActiveSubscription = user.paymentSubscriptionStatus === PaymentSubscriptionStatus.ACTIVE;

    const userHaveTrialQuotes = worksCount < user.trialWorkLimit;

    const canCreateWork = userHaveActiveSubscription || userHaveTrialQuotes;

    if (!canCreateWork) return left(new InvalidWorkOperationError("User don't have trial quotes"));

    const work = Work.create({
      category,
      chapter: new Chapter(chapter),
      nextChapter: new Chapter(null),
      name,
      url,
      createdAt: new Date(),
      userId,
      status: WorkStatus.READ,
      tagsId: tagsId,
    });

    await this.workRepository.create(work);

    if (image) {
      await this.uploadWorkImage.execute({
        fileType: image.imageType,
        imageBuffer: image.imageFile,
        workId: work.id,
      });
    }

    return right({ work });
  }
}
