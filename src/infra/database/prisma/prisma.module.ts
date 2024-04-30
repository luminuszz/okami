import { PrismaAccessTokenRepository } from '@infra/database/prisma/prisma-access-token.repository';
import { PrismaUserRepository } from '@infra/database/prisma/prisma-user.repository';
import { Module } from '@nestjs/common';
import { PrismaTagRepository } from './prisma-tag.repository';
import { PrismaWorkRepository } from './prisma-work.repository';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    PrismaWorkRepository,
    PrismaUserRepository,
    PrismaAccessTokenRepository,
    PrismaTagRepository,
  ],
  exports: [
    PrismaService,
    PrismaWorkRepository,
    PrismaUserRepository,
    PrismaAccessTokenRepository,
    PrismaTagRepository,
  ],
})
export class PrismaModule {}
