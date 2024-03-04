import { Module } from '@nestjs/common';
import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { StorageProvider } from '@domain/work/application/contracts/storageProvider';

@Module({
  providers: [
    {
      provide: StorageProvider,
      useClass: CloudFlareR2StorageAdapter,
    },
  ],

  exports: [StorageProvider],
})
export class StorageModule {}
