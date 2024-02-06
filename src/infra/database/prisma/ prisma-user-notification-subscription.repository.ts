import { UserNotificationSubscriptionRepository } from '@domain/notification/application/repositories/user-notification-subscription.repository';
import { UserNotificationSubscription } from '@domain/notification/enterprise/entities/user-notification-subscription';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { notificationTypeEnumMapper } from './prisma-mapper';

@Injectable()
export class PrismaUserNotificationSubscriptionRepository implements UserNotificationSubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userNotificationSubscription: UserNotificationSubscription): Promise<void> {
    await this.prisma.userNotificationSubscription.create({
      data: {
        createdAt: userNotificationSubscription.createdAt,
        credentials: userNotificationSubscription.credentials,
        id: userNotificationSubscription.id,
        userId: userNotificationSubscription.userId,
        notificationType: notificationTypeEnumMapper(userNotificationSubscription.notificationType),
      },
    });
  }
}
