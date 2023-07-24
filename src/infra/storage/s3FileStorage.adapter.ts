import { FiletoUpload, StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { Injectable } from '@nestjs/common';
import { ListObjectsV2Command, PutObjectCommand, S3 } from '@aws-sdk/client-s3';

@Injectable()
export class S3FileStorageAdapter implements StorageProvider {
  private readonly s3Client: S3;

  private readonly bucketName = 'okami-storage';

  constructor() {
    this.s3Client = new S3({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIA3J36C7ABTNAV2SWV',
        secretAccessKey: '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',
      },
    });
  }

  private async createFolderIfNotExists(folderPrefix: string) {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
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
      Bucket: this.bucketName,
      Key: folderPrefix,
    });

    await this.s3Client.send(createFolderCommand);
  }

  async uploadWorkImage({ fileName, fileData, fileMimeType }: FiletoUpload): Promise<void> {
    await this.s3Client.putObject({
      Body: Buffer.from(fileData),
      Key: `${fileName}.${fileMimeType}`,
      Bucket: this.bucketName,
    });
  }

  async createWorkImageURL(fileName: string): Promise<string> {
    return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
  }
}
