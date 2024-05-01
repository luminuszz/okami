import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { UploadWorkImageUseCase } from '@domain/work/application/usecases/upload-work-image';
import { PrismaAccessTokenRepository } from '@infra/database/prisma/prisma-access-token.repository';
import { PrismaUserRepository } from '@infra/database/prisma/prisma-user.repository';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { QueueModule } from '@infra/queue/queue.module';
import { StorageModule } from '@infra/storage/storage.module';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BatchService } from './batchs/batch.service';
import { NotionDatabaseModule } from './notion/notion-database.module';
import { PrismaWorkRepository } from './prisma/prisma-work.repository';
import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { PrismaTagRepository } from './prisma/prisma-tag.repository';

@Global()
@Module({
  imports: [NotionDatabaseModule, QueueModule, PrismaModule, StorageModule, CqrsModule],
  providers: [
    PrismaService,
    BatchService,
    UploadWorkImageUseCase,
    { provide: WorkRepository, useClass: PrismaWorkRepository },
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: AccessTokenRepository, useClass: PrismaAccessTokenRepository },
    { provide: TagRepository, useClass: PrismaTagRepository },
  ],
  exports: [WorkRepository, BatchService, UserRepository, PrismaService, AccessTokenRepository, TagRepository],
})
export class DatabaseModule {}
