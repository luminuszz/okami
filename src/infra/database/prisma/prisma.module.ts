import { PrismaAccessTokenRepository } from '@infra/database/prisma/prisma-access-token.repository';
import { PrismaMobilePushSubscriptionRepository } from '@infra/database/prisma/prisma-mobile-subscription.repository';
import { PrismaNotificationRepository } from '@infra/database/prisma/prisma-notification.repository';
import { PrismaSearchTokenRepository } from '@infra/database/prisma/prisma-search-token.repository';
import { PrismaSubscriberRepository } from '@infra/database/prisma/prisma-subscriber.repository';
import { PrismaUserRepository } from '@infra/database/prisma/prisma-user.repository';
import { PrismaWebPushSubscriptionRepository } from '@infra/database/prisma/prisma-web-push-subscription.repository';
import { Module } from '@nestjs/common';
import { PrismaRefreshTokenRepository } from './prisma-refresh-token.repository';
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
    PrismaSearchTokenRepository,
    PrismaMobilePushSubscriptionRepository,
    PrismaWebPushSubscriptionRepository,
    PrismaNotificationRepository,
    PrismaSubscriberRepository,
    PrismaRefreshTokenRepository,
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
    PrismaRefreshTokenRepository,
  ],
})
export class PrismaModule {}
