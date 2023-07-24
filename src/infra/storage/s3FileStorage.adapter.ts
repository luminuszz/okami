import { FiletoUpload, StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { Injectable } from '@nestjs/common';
import { ListObjectsV2Command, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';

@Injectable()
export class S3FileStorageAdapter implements StorageProvider {
  private readonly s3Client: S3;

  public readonly awsBucket: string;

  constructor(private config: ConfigService) {
    this.s3Client = new S3({
      region: this.config.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get<string>('AWS_SECRET_KEY_ACCESS'),
      },
    });

    this.awsBucket = this.config.get<string>('AWS_S3_BUCKET');
  }

  private async createFolderIfNotExists(folderPrefix: string) {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: this.awsBucket,
      Prefix: folderPrefix,
      MaxKeys: 1,
    });

    const results = await this.s3Client.send(listObjectsCommand);

    const existsFolder = results.Contents?.length > 0;

    if (!existsFolder) {
      await this.createS3Folder(folderPrefix);
    }
  }

  private async createS3Folder(folderPrefix: string) {
    if (!folderPrefix.endsWith('/')) {
      folderPrefix += '/';
    }

    const createFolderCommand = new PutObjectCommand({
      Bucket: this.awsBucket,
      Key: folderPrefix,
    });

    await this.s3Client.send(createFolderCommand);
  }

  async uploadWorkImage({ fileName, fileData, fileMimeType }: FiletoUpload): Promise<void> {
    await this.createFolderIfNotExists('work-images');

    await this.s3Client.putObject({
      Bucket: this.awsBucket,
      Body: Buffer.from(fileData),
      Key: `work-images/${fileName}.${fileMimeType}`,
      ContentType: `image/${fileMimeType}`,
    });
  }

  static createWorkImageURL(fileName: string): string {
    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/work-images/${fileName}`;
  }
}
