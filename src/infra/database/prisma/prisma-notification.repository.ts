import { Injectable } from '@nestjs/common';
import { Notification as PrismaNotification } from '@prisma/client';

import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { NotificationRepository } from '@domain/notifications/application/contracts/notification.repository';
import { Notification } from '@domain/notifications/enterprise/entities/notifications';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private parseToEntity(prismaNotification: PrismaNotification): Notification {
    return Notification.create(
      {
        content: prismaNotification.content,
        createdAt: prismaNotification.createdAt,
        subscriberId: prismaNotification.subscriberId,
        channels: prismaNotification.channels as any,
        providers: prismaNotification.providers as any,
        readAt: prismaNotification.readAt,
      },
      new UniqueEntityID(prismaNotification.id),
    );
  }

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        content: notification.content,
        id: notification.id,
        readAt: notification.readAt,
        subscriberId: notification.subscriberId,
        createdAt: notification.createdAt,
        channels: notification.channels,
        providers: notification.providers,
      },
    });
  }

  async fetchRecentSubscriberNotifications(subscriberId: string): Promise<Notification[]> {
    const results = await this.prisma.notification.findMany({
      where: {
        subscriberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    return results.map((notification) => this.parseToEntity(notification));
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const results = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    return results ? this.parseToEntity(results) : null;
  }

  async save(notification: Notification): Promise<void> {
    await this.prisma.notification.update({
      where: {
        id: notification.id,
      },

      data: {
        channels: notification.channels,
        content: notification.content,
        createdAt: notification.createdAt,
        providers: notification.providers,
        subscriberId: notification.subscriberId,
        readAt: notification.readAt,
      },
    });
  }
}
