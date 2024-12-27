import { GenerateWorkImageUploadUrlUseCase } from '@domain/work/application/usecases/generate-work-image-upload-url';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export type Image = {
  filename: string;
  filetype: string;
};

export class GenerateWorkImageUploadUrlCommand {
  constructor(
    public readonly image: Image,
    public readonly workId: string,
  ) {}
}

export type GenerateWorkImageUploadUrlCommandResults = {
  url: string;
  filename: string;
};

@CommandHandler(GenerateWorkImageUploadUrlCommand)
export class GenerateWorkImageUploadUrlCommandHandler
  implements ICommandHandler<GenerateWorkImageUploadUrlCommand, GenerateWorkImageUploadUrlCommandResults>
{
  constructor(private readonly stu: GenerateWorkImageUploadUrlUseCase) {}

  async execute({
    image,
    workId,
  }: GenerateWorkImageUploadUrlCommand): Promise<GenerateWorkImageUploadUrlCommandResults> {
    const results = await this.stu.execute({
      image: {
        fileName: image.filename,
        fileType: image.filetype,
      },
      workId,
    });

    if (results.isLeft()) {
      throw results.value;
    }

    return {
      filename: results.value.filename,
      url: results.value.uploadUrl,
    };
  }
}
