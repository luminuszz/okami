import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Module } from '@nestjs/common';
import { BatchService } from './batchs/batch.service';
import { NotionModule } from './notion/notion.module';
import { PrismaWorkRepository } from './prisma/prisma-work.repository';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, NotionModule],
  providers: [
    { provide: WorkRepository, useClass: PrismaWorkRepository },
    BatchService,
  ],
  exports: [WorkRepository, BatchService],
})
export class DatabaseModule {}
