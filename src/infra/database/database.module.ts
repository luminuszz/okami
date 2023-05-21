import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Module } from '@nestjs/common';
import { PrismaWorkRepository } from './prisma/prisma-work.repository';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: WorkRepository,
      useClass: PrismaWorkRepository,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: WorkRepository,
      useClass: PrismaWorkRepository,
    },
  ],
})
export class DatabaseModule {}
