import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { SqsQueueProvider } from '@infra/queue/sqs-queue.provider';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: QueueProvider,
      useClass: SqsQueueProvider,
    },
  ],
  exports: [QueueProvider],
})
export class QueueModule {}
