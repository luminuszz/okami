import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { UserNotFound } from '@domain/auth/application/errors/UserNotFound';
import { User } from '@domain/auth/enterprise/entities/User';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { randomUUID } from 'node:crypto';

interface UploadAvatarUrlInput {
  user_id: string;
  image: ArrayBuffer;
  imageType: string;
}

type UploadAvatarUrlOutput = Either<UserNotFound, { user: User }>;

@Injectable()
export class UploadUserAvatarImage implements UseCaseImplementation<UploadAvatarUrlInput, UploadAvatarUrlOutput> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute({ user_id, image, imageType }: UploadAvatarUrlInput): Promise<UploadAvatarUrlOutput> {
    const userOrUndefined = await this.userRepository.findById(user_id);

    if (!userOrUndefined) {
      return left(new UserNotFound());
    }

    const imageName = `${user_id}-${randomUUID()}`;

    const response = await this.storageProvider.uploadAvatarImage({
      fileName: imageName,
      fileData: image,
      fileMimeType: imageType,
    });

    userOrUndefined.avatarImageId = `${response.fileName}.${response.fileType}`;

    await this.userRepository.save(userOrUndefined);

    return right({
      user: userOrUndefined,
    });
  }
}
