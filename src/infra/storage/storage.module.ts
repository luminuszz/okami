import { Module } from '@nestjs/common';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';
import { StorageProvider } from '@domain/work/application/contracts/storageProvider';

@Module({
  providers: [
    {
      provide: StorageProvider,
      useClass: S3FileStorageAdapter,
    },
  ],

  exports: [StorageProvider],
})
export class StorageModule {}
