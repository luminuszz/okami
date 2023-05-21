import { Module } from '@nestjs/common';
import { PrismaWorkRepository } from './prisma-work.repository';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  providers: [PrismaService, PrismaWorkRepository],
  exports: [PrismaService, PrismaWorkRepository],
})
export class PrismaModule {}
