import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Channel } from './channel';
import { MobilePushSubscription } from './mobile-push-subscription';
import { WebPushSubscription } from './web-push-subscription';
import { Notification } from './notifications';
import { Entity } from '@core/entities/entity';

export interface SubscriberProps {
  recipientId: string;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  telegramChatId?: string;

  channels?: Channel[];
  mobilePushSubscriptions?: MobilePushSubscription[];
  webPushSubscriptions?: WebPushSubscription[];
  authCode?: string;
  notifications?: Notification[];
}

export class Subscriber extends Entity<SubscriberProps> {
  private constructor(props: SubscriberProps, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.mobilePushSubscriptions = props.mobilePushSubscriptions ?? [];
    this.props.webPushSubscriptions = props.webPushSubscriptions ?? [];
    this.props.authCode = props.authCode;
  }

  public static create(props: SubscriberProps, id?: UniqueEntityID): Subscriber {
    return new Subscriber(props, id);
  }

  get recipientId(): string {
    return this.props.recipientId;
  }

  get telegramChatId(): string | undefined {
    return this.props.telegramChatId;
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  public get channels() {
    return this.props.channels;
  }

  public set telegramChatId(telegramChatId: string) {
    this.props.telegramChatId = telegramChatId;
    this.update();
  }

  public get mobilePushSubscriptions() {
    return this.props.mobilePushSubscriptions;
  }

  public get webPushSubscriptions() {
    return this.props.webPushSubscriptions;
  }

  public get email() {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  get authCode() {
    return this.props.authCode as string;
  }

  public set authCode(authCode: string) {
    this.props.authCode = authCode;
    this.update();
  }

  public compareAuthCode(authCode: string) {
    return this.props.authCode === authCode;
  }
}
