import { Channel } from '@domain/notifications/enterprise/entities/channel';

export abstract class ChannelRepository {
  abstract create(channel: Channel): Promise<void>;
  abstract save(channel: Channel): Promise<void>;
  abstract findById(channelId: string): Promise<Channel | null>;
}
