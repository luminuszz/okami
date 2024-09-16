import { UniqueEntityID } from '@core/entities/unique-entity-id';

import { Injectable } from '@nestjs/common';
import {
  MobileSubscription as PrismaMobileSubscription,
  Notification as PrismaNotification,
  Subscriber as PrismaSubscriber,
  WebPushSubscription as PrismaWebPushSubscription,
} from '@prisma/client';
import { map } from 'lodash';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Subscriber } from '@domain/notifications/enterprise/entities/subscriber';
import { MobilePushSubscription } from '@domain/notifications/enterprise/entities/mobile-push-subscription';
import { WebPushSubscription } from '@domain/notifications/enterprise/entities/web-push-subscription';

interface PrismaSubscriberWithRelations extends PrismaSubscriber {
  webPushSubscriptions?: PrismaWebPushSubscription[];
  mobileSubscriptions?: PrismaMobileSubscription[];
  notifications?: PrismaNotification[];
}

@Injectable()
export class PrismaSubscriberRepository implements SubscriberRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(subscriber: PrismaSubscriberWithRelations): Subscriber {
    return Subscriber.create(
      {
        recipientId: subscriber.recipientId,
        telegramChatId: subscriber.telegramId || '',
        createdAt: subscriber.createdAt,
        email: subscriber.email ?? '',
        authCode: subscriber.authCode ?? '',
        mobilePushSubscriptions: map(subscriber.mobileSubscriptions, (content) =>
          MobilePushSubscription.create(
            {
              createdAt: content.createdAt,
              subscriberId: content.subscriberId,
              subscriptionToken: content.subscriptionToken,
            },
            new UniqueEntityID(content.id),
          ),
        ),
        webPushSubscriptions: map(subscriber.webPushSubscriptions, (content) =>
          WebPushSubscription.create(
            {
              createdAt: content.createdAt,
              endpoint: content.endpoint,
              subscriberId: content.subscriberId,
              webPushSubscriptionAuth: content.auth,
              webPushSubscriptionP256dh: content.p256dh,
            },
            new UniqueEntityID(content.id),
          ),
        ),
      },

      new UniqueEntityID(subscriber.id),
    );
  }

  async create(subscriber: Subscriber): Promise<void> {
    await this.prisma.subscriber.create({
      data: {
        id: subscriber.id,
        recipientId: subscriber.recipientId,
        telegramId: subscriber.telegramChatId,
        email: subscriber.email,
        authCode: subscriber.authCode,
        createdAt: new Date(),
      },
    });
  }
  async findById(subscriberId: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        id: subscriberId,
      },
    });

    return results ? this.toEntity(results) : null;
  }

  async save(subscriber: Subscriber): Promise<void> {
    await this.prisma.subscriber.update({
      where: {
        id: subscriber.id,
      },
      data: {
        telegramId: subscriber.telegramChatId,
        authCode: subscriber.authCode,
        email: subscriber.email,
      },
    });
  }

  async getSubscriptions(subscriberId: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        id: subscriberId,
      },
      include: {
        mobileSubscriptions: true,
        webPushSubscriptions: true,
      },
    });

    return results ? this.toEntity(results) : null;
  }

  async findByRecipientId(recipientId: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        recipientId,
      },
    });

    return results ? this.toEntity(results) : null;
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const results = await this.prisma.subscriber.findUnique({
      where: {
        email,
      },
    });

    return results ? this.toEntity(results) : null;
  }
}
