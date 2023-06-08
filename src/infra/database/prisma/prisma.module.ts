import { Module } from '@nestjs/common';
import { PrismaNotificationRepository } from './prisma-notification.repository';
import { PrismaWorkRepository } from './prisma-work.repository';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  providers: [
    PrismaService,
    PrismaWorkRepository,
    PrismaNotificationRepository,
  ],
  exports: [PrismaService, PrismaWorkRepository, PrismaNotificationRepository],
})
export class PrismaModule {}
