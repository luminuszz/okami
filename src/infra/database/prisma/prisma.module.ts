import { Module } from '@nestjs/common';
import { PrismaNotificationRepository } from './prisma-notification.repository';
import { PrismaWorkRepository } from './prisma-work.repository';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from '@infra/database/prisma/prisma-user.repository';
import { PrismaAccessTokenRepository } from '@infra/database/prisma/prisma-access-token.repository';

@Module({
  providers: [
    PrismaService,
    PrismaWorkRepository,
    PrismaNotificationRepository,
    PrismaUserRepository,
    PrismaAccessTokenRepository,
  ],
  exports: [
    PrismaService,
    PrismaWorkRepository,
    PrismaNotificationRepository,
    PrismaUserRepository,
    PrismaAccessTokenRepository,
  ],
})
export class PrismaModule {}
