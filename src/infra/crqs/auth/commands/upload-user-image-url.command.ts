import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadUserAvatarImage } from '@domain/auth/application/useCases/upload-user-avatar-image';

interface Payload {
  userId: string;
  imageFile: ArrayBuffer;
  imageType: string;
}

export class UploadUserImageUrlCommand {
  constructor(public readonly payload: Payload) {}
}

@CommandHandler(UploadUserImageUrlCommand)
export class UploadUserImageUrlCommandHandler implements ICommandHandler<UploadUserImageUrlCommand> {
  constructor(private readonly uploadUserAvatarImage: UploadUserAvatarImage) {}

  async execute({ payload }: UploadUserImageUrlCommand): Promise<any> {
    const results = await this.uploadUserAvatarImage.execute({
      image: payload.imageFile,
      imageType: payload.imageType,
      user_id: payload.userId,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
