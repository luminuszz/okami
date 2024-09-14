import { Either, left, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';
import { Injectable } from '@nestjs/common';
import { ResourceNotFound } from '@core/errors/resource-not-found';
import { Channel } from '@domain/notifications/enterprise/entities/channel';
import { ChannelRepository } from '@domain/notifications/application/contracts/channel-repository';
import { SubscriberRepository } from '@domain/notifications/application/contracts/subscriber-repository';

export interface SubscribeInChannelProps {
  channelId: string;
  subscriberId: string;
}

type SubscribeInChannelResponse = Either<ResourceNotFound, { channel: Channel }>;

@Injectable()
export class SubscribeInChannel implements UseCaseImplementation<SubscribeInChannelProps, SubscribeInChannelResponse> {
  constructor(
    private readonly channelRepo: ChannelRepository,
    private readonly subscriberRepo: SubscriberRepository,
  ) {}

  async execute({ subscriberId, channelId }: SubscribeInChannelProps): Promise<SubscribeInChannelResponse> {
    const channel = await this.channelRepo.findById(channelId);
    const subscriber = await this.subscriberRepo.findById(subscriberId);

    if (!channel) return left(new ResourceNotFound('Channel'));
    if (!subscriber) return left(new ResourceNotFound('Subscriber'));

    channel.addSubscriber(subscriber);

    await this.channelRepo.save(channel);

    return right({ channel });
  }
}
