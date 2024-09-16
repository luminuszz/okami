import { PrismaAccessTokenRepository } from '@infra/database/prisma/prisma-access-token.repository';
import { PrismaUserRepository } from '@infra/database/prisma/prisma-user.repository';
import { Module } from '@nestjs/common';
import { PrismaTagRepository } from './prisma-tag.repository';
import { PrismaWorkRepository } from './prisma-work.repository';
import { PrismaService } from './prisma.service';
import { PrismaSearchTokenRepository } from '@infra/database/prisma/prisma-search-token.repository';
import { PrismaMobilePushSubscriptionRepository } from '@infra/database/prisma/prisma-mobile-subscription.repository';
import { PrismaWebPushSubscriptionRepository } from '@infra/database/prisma/prisma-web-push-subscription.repository';
import { PrismaNotificationRepository } from '@infra/database/prisma/prisma-notification.repository';
import { PrismaSubscriberRepository } from '@infra/database/prisma/prisma-subscriber.repository';

@Module({
  providers: [
    PrismaService,
    PrismaWorkRepository,
    PrismaUserRepository,
    PrismaAccessTokenRepository,
    PrismaTagRepository,
    PrismaSearchTokenRepository,
    PrismaMobilePushSubscriptionRepository,
    PrismaWebPushSubscriptionRepository,
    PrismaNotificationRepository,
    PrismaSubscriberRepository,
  ],
  exports: [
    PrismaService,
    PrismaWorkRepository,
    PrismaUserRepository,
    PrismaAccessTokenRepository,
    PrismaTagRepository,
    PrismaSearchTokenRepository,
    PrismaMobilePushSubscriptionRepository,
    PrismaWebPushSubscriptionRepository,
    PrismaNotificationRepository,
    PrismaSubscriberRepository,
  ],
})
export class PrismaModule {}
