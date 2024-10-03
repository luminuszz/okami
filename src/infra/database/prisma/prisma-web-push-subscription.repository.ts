import { WebPushSubscription as PrismaWebPushSubscription } from '@prisma/client';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { WePushSubscriptionRepository } from '@domain/notifications/application/contracts/web-push-subscription-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { WebPushSubscription } from '@domain/notifications/enterprise/entities/web-push-subscription';

@Injectable()
export class PrismaWebPushSubscriptionRepository implements WePushSubscriptionRepository {
  constructor(private prisma: PrismaService) {}
  async findSubscriptionByEndpoint(endpoint: string): Promise<WebPushSubscription | null> {
    const response = await this.prisma.webPushSubscription.findFirst({
      where: {
        endpoint,
      },
    });

    return response ? this.toEntity(response) : null;
  }
  async save(webPushSubscription: WebPushSubscription): Promise<void> {
    await this.prisma.webPushSubscription.update({
      where: {
        id: webPushSubscription.id.toString(),
      },
      data: {
        auth: webPushSubscription.webPushSubscriptionAuth,
        createdAt: webPushSubscription.createdAt,
        endpoint: webPushSubscription.endpoint,
        p256dh: webPushSubscription.webPushSubscriptionP256dh,
        subscriberId: webPushSubscription.subscriberId,
      },
    });
  }

  private toEntity(prismaData: PrismaWebPushSubscription): WebPushSubscription {
    return WebPushSubscription.create(
      {
        createdAt: prismaData.createdAt,
        endpoint: prismaData.endpoint,
        subscriberId: prismaData.subscriberId,
        webPushSubscriptionAuth: prismaData.auth,
        webPushSubscriptionP256dh: prismaData.p256dh,
      },
      new UniqueEntityID(prismaData.id),
    );
  }

  async findById(id: string): Promise<WebPushSubscription | null> {
    const results = await this.prisma.webPushSubscription.findUnique({
      where: {
        id,
      },
    });

    return results ? this.toEntity(results) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.webPushSubscription.delete({
      where: {
        id,
      },
    });
  }

  async create(webPushSubscription: WebPushSubscription): Promise<void> {
    console.log(webPushSubscription);

    await this.prisma.webPushSubscription.create({
      data: {
        p256dh: webPushSubscription.webPushSubscriptionP256dh,
        auth: webPushSubscription.webPushSubscriptionAuth,
        createdAt: webPushSubscription.createdAt,
        id: webPushSubscription.id,
        subscriberId: webPushSubscription.subscriberId,
        endpoint: webPushSubscription.endpoint,
      },
    });
  }
}
