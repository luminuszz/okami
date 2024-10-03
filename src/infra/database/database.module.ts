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
import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';
import { PrismaSearchTokenRepository } from '@infra/database/prisma/prisma-search-token.repository';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';
import { PrismaSubscriberRepository } from '@infra/database/prisma/prisma-subscriber.repository';
import { MobilePushSubscriptionRepository } from '@domain/notifications/application/contracts/mobile-push-subscription-repository';
import { PrismaMobilePushSubscriptionRepository } from '@infra/database/prisma/prisma-mobile-subscription.repository';
import { PrismaWebPushSubscriptionRepository } from '@infra/database/prisma/prisma-web-push-subscription.repository';
import { WePushSubscriptionRepository } from '@domain/notifications/application/contracts/web-push-subscription-repository';
import { NotificationRepository } from '@domain/notifications/application/contracts/notification.repository';
import { PrismaNotificationRepository } from '@infra/database/prisma/prisma-notification.repository';

@Global()
@Module({
  imports: [NotionDatabaseModule, QueueModule, PrismaModule, StorageModule, CqrsModule],
  providers: [
    PrismaService,
    BatchService,
    UploadWorkImageUseCase,
    { provide: NotificationRepository, useClass: PrismaNotificationRepository },
    { provide: WorkRepository, useClass: PrismaWorkRepository },
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: AccessTokenRepository, useClass: PrismaAccessTokenRepository },
    { provide: TagRepository, useClass: PrismaTagRepository },
    { provide: SearchTokenRepository, useClass: PrismaSearchTokenRepository },
    { provide: SubscriberRepository, useClass: PrismaSubscriberRepository },
    { provide: MobilePushSubscriptionRepository, useClass: PrismaMobilePushSubscriptionRepository },
    { provide: WePushSubscriptionRepository, useClass: PrismaWebPushSubscriptionRepository },
  ],
  exports: [
    WorkRepository,
    BatchService,
    UserRepository,
    PrismaService,
    AccessTokenRepository,
    TagRepository,
    SearchTokenRepository,
    SubscriberRepository,
    WePushSubscriptionRepository,
    MobilePushSubscriptionRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
