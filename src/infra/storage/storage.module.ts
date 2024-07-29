import { Module } from '@nestjs/common';
import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { StorageProvider } from '@domain/work/application/contracts/storageProvider';
import { ImageTransformerProvider, SharpImageTransformerProvider } from '@infra/storage/image-transformer.provider';

@Module({
  providers: [
    {
      provide: StorageProvider,
      useClass: CloudFlareR2StorageAdapter,
    },
    {
      provide: ImageTransformerProvider,
      useClass: SharpImageTransformerProvider,
    },
  ],

  exports: [StorageProvider],
})
export class StorageModule {}
