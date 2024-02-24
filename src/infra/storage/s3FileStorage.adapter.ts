import { FiletoUpload, FiletoUploadWithUrl, StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { Injectable } from '@nestjs/common';
import { ListObjectsV2Command, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import * as process from 'process';
import { EnvService } from '../env/env.service';

@Injectable()
export class S3FileStorageAdapter implements StorageProvider {
  private readonly s3Client: S3;

  public readonly awsBucket: string;

  constructor(private env: EnvService) {
    this.s3Client = new S3({
      region: this.env.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.env.get('AWS_SECRET_KEY_ACCESS'),
      },
    });

    this.awsBucket = this.env.get('AWS_S3_BUCKET');
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

  static createS3FileUrl(fileName: string): string {
    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/work-images/${fileName}`;
  }

  async uploadWorkImageWithUrl(file: FiletoUploadWithUrl): Promise<void> {
    const response = await fetch(file.fileData);

    const buffer = await response.arrayBuffer();

    await this.uploadWorkImage({
      fileName: file.fileName,
      fileData: buffer,
      fileMimeType: file.fileMimeType,
    });
  }
}
