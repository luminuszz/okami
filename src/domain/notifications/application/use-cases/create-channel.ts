import { Either, right } from '@core/either';
import { UseCaseImplementation } from '@core/use-case';

import { Injectable } from '@nestjs/common';
import { Channel } from '@domain/notifications/enterprise/entities/channel';
import { ChannelRepository } from '@domain/notifications/application/contracts/channel-repository';

interface CreateChannelProps {
  name: string;
  description: string;
}

type CreateChannelResponse = Either<void, { channel: Channel }>;

@Injectable()
export class CreateChannel implements UseCaseImplementation<CreateChannelProps, CreateChannelResponse> {
  constructor(private readonly channelRepo: ChannelRepository) {}

  async execute({ description, name }: CreateChannelProps): Promise<CreateChannelResponse> {
    const channel = Channel.create({
      description,
      name,
      createdAt: new Date(),
      subscribers: [],
    });

    await this.channelRepo.create(channel);

    return right({
      channel,
    });
  }
}
