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
  abstract compressAndTransformImageToWebp(image: ImageData): Promise<ImageResponse>;
}

@Injectable()
export class SharpImageTransformerProvider implements ImageTransformerProvider {
  async compressAndTransformImageToWebp({ fileName, fileData }: ImageData): Promise<ImageResponse> {
    const fileBuffer = await sharp(fileData)
      .webp({
        quality: 80,
      })
      .toBuffer();

    return {
      fileData: fileBuffer,
      fileMimeType: 'webp',
      fileName,
    };
  }
}
