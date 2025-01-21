import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  FileUploadResponse,
  FiletoUpload,
  FiletoUploadWithUrl,
  StorageProvider,
} from '@domain/work/application/contracts/storageProvider'
import { ImageTransformerProvider } from '@infra/storage/image-transformer.provider'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class CloudFlareR2StorageAdapter implements StorageProvider {
  private readonly s3Client: S3Client
  public readonly awsBucket: string

  constructor(
    private readonly env: EnvService,
    private readonly imageTransformer: ImageTransformerProvider,
  ) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.env.get('CLOUD_FLARE_BUCKET_URL'),
      credentials: {
        accessKeyId: this.env.get('CLOUD_FLARE_R2_KEY'),
        secretAccessKey: this.env.get('CLOUD_FLARE_R2_SECRET_KEY'),
      },
    })

    this.awsBucket = this.env.get('CLOUD_FLARE_BUCKET')

    this.s3Client.middlewareStack.addRelativeTo(
      (next) => async (args) => {
        delete args.request.headers['x-amz-checksum-crc32']
        return next(args)
      },
      {
        relation: 'after',
        toMiddleware: 'headerMiddleware',
      },
    )
  }

  async createUploadUrl(fileName: string, fileType: string): Promise<string> {
    await this.createFolderIfNotExists('work-images')

    const puts3Command = new PutObjectCommand({
      Bucket: this.awsBucket,
      Key: `work-images/${fileName}.${fileType}`,
      ContentType: `image/${fileType}`,
    })

    const uploadUrl = await getSignedUrl(this.s3Client, puts3Command, { expiresIn: 3600 })

    return uploadUrl
  }

  static createS3FileUrl(fileName: string): string {
    return `${process.env.CLOUD_FLARE_PUBLIC_BUCKET_URL}/work-images/${fileName}`
  }

  static createS3AvatarUrl(fileName: string): string {
    return `${process.env.CLOUD_FLARE_PUBLIC_BUCKET_URL}/user-avatars-images/${fileName}`
  }

  async uploadAvatarImage({ fileName, fileData }: FiletoUpload): Promise<FileUploadResponse> {
    await this.createFolderIfNotExists('user-avatars-images')

    const parsedImage = await this.imageTransformer.compressAndTransformImageToWebp({
      fileData,
      fileName,
    })

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.awsBucket,
        Body: parsedImage.fileData,
        Key: `user-avatars-images/${parsedImage.fileName}.${parsedImage.fileMimeType}`,
        ContentType: `image/${parsedImage.fileMimeType}`,
      }),
    )

    return {
      fileType: parsedImage.fileMimeType,
      fileName: parsedImage.fileName,
    }
  }

  private async createFolderIfNotExists(folderPrefix: string) {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: this.awsBucket,
      Prefix: folderPrefix,
      MaxKeys: 1,
    })

    const results = await this.s3Client.send(listObjectsCommand)

    const existsFolder = results.Contents?.length > 0

    if (!existsFolder) {
      await this.createS3Folder(folderPrefix)
    }
  }

  private async createS3Folder(folderPrefix: string) {
    if (!folderPrefix.endsWith('/')) {
      folderPrefix += '/'
    }

    const createFolderCommand = new PutObjectCommand({
      Bucket: this.awsBucket,
      Key: folderPrefix,
    })

    await this.s3Client.send(createFolderCommand)
  }

  async uploadWorkImage({ fileName, fileData }: FiletoUpload): Promise<FileUploadResponse> {
    await this.createFolderIfNotExists('work-images')

    const parsedImage = await this.imageTransformer.compressAndTransformImageToWebp({
      fileData,
      fileName,
    })

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.awsBucket,
        Body: parsedImage.fileData,
        Key: `work-images/${parsedImage.fileName}.${parsedImage.fileMimeType}`,
        ContentType: `image/${parsedImage.fileMimeType}`,
      }),
    )

    return {
      fileType: parsedImage.fileMimeType,
      fileName: parsedImage.fileName,
    }
  }

  async uploadWorkImageWithUrl({ fileName, fileData }: FiletoUploadWithUrl): Promise<FileUploadResponse> {
    await this.createFolderIfNotExists('work-images')

    const response = await fetch(fileData)

    const buffer = await response.arrayBuffer()

    const parsedImage = await this.imageTransformer.compressAndTransformImageToWebp({
      fileData: buffer,
      fileName,
    })

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.awsBucket,
        Body: parsedImage.fileData,
        Key: `work-images/${parsedImage.fileName}.${parsedImage.fileMimeType}`,
        ContentType: `image/${parsedImage.fileMimeType}`,
      }),
    )
    return {
      fileType: parsedImage.fileMimeType,
      fileName: parsedImage.fileName,
    }
  }
}
