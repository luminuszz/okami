import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { SqsQueueProvider } from '@infra/queue/sqs-queue.provider';
import loadSecrets from '@infra/utils/getSecretsEnv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
