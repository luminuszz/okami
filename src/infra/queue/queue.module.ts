import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullQueueProvider } from '@infra/queue/bull-queue.provider';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import loadSecrets from '@infra/utils/getSecretesEnv';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadSecrets],
    }),
  ],
  providers: [
    {
      provide: QueueProvider,
      useClass: BullQueueProvider,
    },
  ],
  exports: [QueueProvider],
})
export class QueueModule {}
