import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';
import { StorageProvider } from '@domain/work/application/contracts/storageProvider';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: StorageProvider,
      useClass: S3FileStorageAdapter,
    },
  ],

  exports: [StorageProvider],
})
export class StorageModule {}
