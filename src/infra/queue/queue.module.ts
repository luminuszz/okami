import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import loadSecrets from '@infra/utils/getSecretsEnv';
import { SqsQueueProvider } from '@infra/queue/sqs-queue.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadSecrets],
    }),
  ],
  providers: [
    {
      provide: QueueProvider,
      useClass: SqsQueueProvider,
    },
  ],
  exports: [QueueProvider],
})
export class QueueModule {}
