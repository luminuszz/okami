import { NotificationRepository } from '@domain/notification/application/repositories/notification.repository';
import { Notification } from '@domain/notification/enterprise/entities/notification';
import { PrismaService } from './prisma.service';

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        content: notification.content.toString(),
        createdAt: notification.createdAt,
        id: notification.id.toString(),
        readAt: notification.readAt,
        recipientId: notification.recipientId,
      },
    });
  }
}
