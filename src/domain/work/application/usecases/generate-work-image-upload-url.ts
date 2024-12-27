import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { StorageProvider } from '../contracts/storageProvider';
import { WorkRepository } from '../repositories/work-repository';
import { WorkNotFoundError } from './errors/work-not-found';

export type GenerateWorkUploadUrlParams = {
  image: {
    fileType: string;
    fileName: string;
  };

  workId: string;
};

export type GenerateWorkUploadUrlResponse = Either<
  WorkNotFoundError,
  {
    uploadUrl: string;
    filename: string;
  }
>;

@Injectable()
export class GenerateWorkImageUploadUrlUseCase
  implements UseCaseImplementation<GenerateWorkUploadUrlParams, GenerateWorkUploadUrlResponse> {
  constructor(
    private readonly storageProvider: StorageProvider,
    private readonly workRepository: WorkRepository,
  ) { }

  private logger = new Logger();

  async execute({ image, workId }: GenerateWorkUploadUrlParams): Promise<GenerateWorkUploadUrlResponse> {
    const work = await this.workRepository.findById(workId);

    if (!work) {
      return left(new WorkNotFoundError());
    }

    const imageId = randomUUID();

    const fileId = `${work.id}-${imageId}`;

    this.logger.debug(`Creating upload url for image ${imageId}`);

    const url = await this.storageProvider.createUploadUrl(fileId, image.fileType);

    work.imageId = `${imageId}.${image.fileType}`;

    await this.workRepository.save(work);

    return right({
      uploadUrl: url,
      filename: image.fileName,
    });
  }
}
