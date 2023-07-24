import { UseCaseImplementation } from '@core/use-case';
import { Either, left } from '@core/either';
import { WorkNotFoundError } from '@domain/work/application/usecases/errors/work-not-found';
import { Injectable } from '@nestjs/common';
import { StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';

interface UploadWorkImageInput {
  imageBuffer: ArrayBuffer;
  fileType: string;
  workId: string;
}

type UploadWorkImageOutput = Either<WorkNotFoundError, void>;

@Injectable()
export class UploadWorkImageUseCase implements UseCaseImplementation<UploadWorkImageInput, UploadWorkImageOutput> {
  constructor(private storageProvider: StorageProvider, private workRepository: WorkRepository) {}

  async execute({ imageBuffer, workId, fileType }: UploadWorkImageInput): Promise<UploadWorkImageOutput> {
    const work = await this.workRepository.findOne(workId);

    if (!work) return left(new WorkNotFoundError());

    await this.storageProvider.uploadWorkImage({
      fileName: `${work.id}`,
      fileData: imageBuffer,
      fileMimeType: fileType,
    });
  }
}
