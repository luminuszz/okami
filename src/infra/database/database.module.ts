import { NotificationRepository } from '@domain/notification/application/repositories/notification.repository';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { Global, Module } from '@nestjs/common';
import { BatchService } from './batchs/batch.service';
import { NotionDatabaseModule } from './notion/notion-database.module';
import { PrismaNotificationRepository } from './prisma/prisma-notification.repository';
import { PrismaWorkRepository } from './prisma/prisma-work.repository';
import { QueueModule } from '@infra/queue/queue.module';
import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { PrismaUserRepository } from '@infra/database/prisma/prisma-user.repository';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { PrismaAccessTokenRepository } from '@infra/database/prisma/prisma-access-token.repository';
import { PrismaModule } from '@infra/database/prisma/prisma.module';

@Global()
@Module({
  imports: [NotionDatabaseModule, QueueModule, PrismaModule],
  providers: [
    PrismaService,
    BatchService,
    { provide: WorkRepository, useClass: PrismaWorkRepository },
    { provide: NotificationRepository, useClass: PrismaNotificationRepository },
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: AccessTokenRepository, useClass: PrismaAccessTokenRepository },
  ],
  exports: [WorkRepository, NotificationRepository, BatchService, UserRepository, PrismaService, AccessTokenRepository],
})
export class DatabaseModule {}
