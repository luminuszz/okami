import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Subscriber } from './subscriber';
import { NotificationCreated } from '../events/notification-created';
import { Entity } from '@core/entities/entity';

export const Channels = {
  ON_NEW_CHAPTER: 'on-new-chapter',
} as const;

export const Providers = {
  ALL: 'all',
  TELEGRAM: 'telegram',
  WEB_PUSH: 'web-push',
  MOBILE_PUSH: 'mobile-push',
} as const;

export type ChannelsLabels = (typeof Channels)[keyof typeof Channels];
export type ProvidersLabels = (typeof Providers)[keyof typeof Providers];

export interface NotificationProps {
  content: string;
  subscriberId: string;
  readAt?: Date | null;
  createdAt: Date;
  recipient?: Subscriber;
  channels?: ChannelsLabels[];
  providers?: ProvidersLabels[];
}

export class Notification extends Entity<NotificationProps> {
  private constructor(props: NotificationProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.readAt = props.readAt ?? null;
    this.props.channels = props.channels ?? [];

    if (!id) {
      this.events.push(new NotificationCreated(this));
    }
  }
  public static create(props: NotificationProps, id?: UniqueEntityID): Notification {
    return new Notification(props, id);
  }

  get content(): string {
    return this.props.content;
  }

  get subscriberId(): string {
    return this.props.subscriberId;
  }

  get readAt() {
    return this.props.readAt;
  }

  markAsRead(): void {
    this.props.readAt = new Date();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get recipient() {
    return this.props.recipient;
  }

  get channels() {
    return this.props.channels;
  }

  get providers() {
    return this.props.providers;
  }
}
