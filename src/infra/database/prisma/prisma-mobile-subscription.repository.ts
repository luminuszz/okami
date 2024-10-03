import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { MobileSubscription as PrismaMobileSubscription } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { MobilePushSubscription } from '@domain/notifications/enterprise/entities/mobile-push-subscription';
import { MobilePushSubscriptionRepository } from '@domain/notifications/application/contracts/mobile-push-subscription-repository';

@Injectable()
export class PrismaMobilePushSubscriptionRepository implements MobilePushSubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(mobilePushSubscription: MobilePushSubscription): Promise<void> {
    await this.prismaService.mobileSubscription.create({
      data: {
        id: mobilePushSubscription.id,
        subscriptionToken: mobilePushSubscription.subscriptionToken,
        subscriberId: mobilePushSubscription.subscriberId,
      },
    });
  }

  private toEntity(mobilePushSubscription: PrismaMobileSubscription): MobilePushSubscription {
    return MobilePushSubscription.create(
      {
        createdAt: mobilePushSubscription.createdAt,
        subscriberId: mobilePushSubscription.subscriberId,
        subscriptionToken: mobilePushSubscription.subscriptionToken,
      },
      new UniqueEntityID(mobilePushSubscription.id),
    );
  }

  async findBySubscriptionToken(subscriptionToken: string): Promise<MobilePushSubscription | null> {
    const mobileSubscription = await this.prismaService.mobileSubscription.findUnique({
      where: {
        subscriptionToken,
      },
    });

    return mobileSubscription ? this.toEntity(mobileSubscription) : null;
  }
}
