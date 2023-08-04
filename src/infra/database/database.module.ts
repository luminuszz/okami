import { NotificationRepository } from '@domain/notification/application/repositories/notification.repository';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Module } from '@nestjs/common';
import { BatchService } from './batchs/batch.service';
import { NotionModule } from './notion/notion.module';
import { PrismaNotificationRepository } from './prisma/prisma-notification.repository';
import { PrismaWorkRepository } from './prisma/prisma-work.repository';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from '@infra/queue/queue.module';

@Module({
  imports: [PrismaModule, NotionModule, QueueModule],
  providers: [
    { provide: WorkRepository, useClass: PrismaWorkRepository },
    { provide: NotificationRepository, useClass: PrismaNotificationRepository },
    BatchService,
  ],
  exports: [WorkRepository, NotificationRepository, BatchService],
})
export class DatabaseModule {}
