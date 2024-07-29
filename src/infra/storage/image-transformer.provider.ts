import { Injectable } from '@nestjs/common';

import sharp from 'sharp';

export interface ImageData {
  fileName: string;
  fileData: Buffer | ArrayBuffer;
}

export interface ImageResponse {
  fileName: string;
  fileData: Buffer;
  fileMimeType: string;
}

export abstract class ImageTransformerProvider {
  abstract compressAndTransformImageToJPG(image: ImageData): Promise<ImageResponse>;
}

@Injectable()
export class SharpImageTransformerProvider implements ImageTransformerProvider {
  async compressAndTransformImageToJPG({ fileName, fileData }: ImageData): Promise<ImageResponse> {
    const fileBuffer = await sharp(fileData)
      .webp({
        quality: 70,
      })
      .toBuffer();

    return {
      fileData: fileBuffer,
      fileMimeType: 'jpg',
      fileName,
    };
  }
}
