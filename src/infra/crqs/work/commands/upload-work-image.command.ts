import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';

export class UploadWorkImageCommand {
  constructor(
    public readonly workId: string,
    public readonly originalFileName: string,
    public readonly image: Buffer,
  ) {}
}

@CommandHandler(UploadWorkImageCommand)
export class UploadWorkImageCommandHandler implements ICommandHandler<UploadWorkImageCommand> {
  constructor(private readonly uploadWorkImage: UploadWorkImageUseCase) {}

  async execute({ originalFileName, workId, image }: UploadWorkImageCommand): Promise<void> {
    const results = await this.uploadWorkImage.execute({
      imageBuffer: image,
      workId: workId,
      fileType: originalFileName.split('.').pop(),
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
