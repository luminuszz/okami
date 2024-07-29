import { UseCaseImplementation } from '@core/use-case';
import { Either, left, right } from '@core/either';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { Injectable } from '@nestjs/common';
import { FileUploadResponse, StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { randomUUID } from 'node:crypto';
import { Work } from '@domain/work/enterprise/entities/work';

interface UploadWorkImageInput {
  imageBuffer: ArrayBuffer | string;
  fileType: string;
  workId: string;
}

type UploadWorkImageOutput = Either<WorkNotFoundError, Work>;

@Injectable()
export class UploadWorkImageUseCase implements UseCaseImplementation<UploadWorkImageInput, UploadWorkImageOutput> {
  constructor(
    private storageProvider: StorageProvider,
    private workRepository: WorkRepository,
  ) {}

  async execute({ imageBuffer, workId, fileType }: UploadWorkImageInput): Promise<UploadWorkImageOutput> {
    const work = await this.workRepository.findOne(workId);

    if (!work) return left(new WorkNotFoundError());

    const imageId = randomUUID();

    let imageResponse: FileUploadResponse;

    if (typeof imageBuffer === 'string') {
      imageResponse = await this.storageProvider.uploadWorkImageWithUrl({
        fileName: `${work.id}-${imageId}`,
        fileData: imageBuffer,
        fileMimeType: fileType,
      });
    } else {
      imageResponse = await this.storageProvider.uploadWorkImage({
        fileName: `${work.id}-${imageId}`,
        fileData: imageBuffer,
        fileMimeType: fileType,
      });
    }

    work.imageId = `${imageId}.${imageResponse.fileType}`;

    await this.workRepository.save(work);

    return right(work);
  }
}
