import { FiletoUpload, FiletoUploadWithUrl, StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { Injectable } from '@nestjs/common';
import { ListObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as process from 'process';
import { EnvService } from '../env/env.service';
import { chain } from 'lodash';

@Injectable()
export class CloudFlareR2StorageAdapter implements StorageProvider {
  private readonly s3Client: S3Client;

  public readonly awsBucket: string;

  constructor(private env: EnvService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.env.get('CLOUD_FLARE_BUCKET_URL'),
      credentials: {
        accessKeyId: this.env.get('CLOUD_FLARE_R2_KEY'),
        secretAccessKey: this.env.get('CLOUD_FLARE_R2_SECRET_KEY'),
      },
    });

    this.awsBucket = this.env.get('CLOUD_FLARE_BUCKET');
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

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.awsBucket,
        Body: Buffer.from(fileData),
        Key: `work-images/${fileName}.${fileMimeType}`,
        ContentType: `image/${fileMimeType}`,
      }),
    );
  }

  static createS3FileUrl(fileName: string): string {
    return `${process.env.CLOUD_FLARE_PUBLIC_BUCKET_URL}/work-images/${fileName}`;
  }

  async uploadWorkImageWithUrl(file: FiletoUploadWithUrl): Promise<void> {
    const response = await fetch(file.fileData);

    const buffer = await response.arrayBuffer();

    await this.uploadWorkImage({
      fileData: buffer,
      fileName: file.fileName,
      fileMimeType: file.fileMimeType,
    });
  }

  async findAllWorkImagesVersions(workId: string) {
    const command = new ListObjectsCommand({
      Bucket: this.awsBucket,
      Prefix: 'work-images/',
    });

    const results = await this.s3Client.send(command);

    const hashMap = chain(results.Contents)
      .map((item) => {
        const keyWithoutPath = item.Key.replace('work-images/', '');

        return {
          originalKey: keyWithoutPath,
          workOwnerId: keyWithoutPath.split('-')?.[0] ?? '',
          url: CloudFlareR2StorageAdapter.createS3FileUrl(keyWithoutPath),
        };
      })
      .groupBy('workOwnerId')
      .value();

    return hashMap[workId];
  }
}
