import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Entity } from '@core/entities/entity';

export interface WePushSubscriptionProps {
  webPushSubscriptionAuth: string;
  webPushSubscriptionP256dh: string;
  endpoint: string;
  subscriberId: string;

  createdAt: Date;
}

export class WebPushSubscription extends Entity<WePushSubscriptionProps> {
  private constructor(props: WePushSubscriptionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: WePushSubscriptionProps, id?: UniqueEntityID): WebPushSubscription {
    return new WebPushSubscription(props, id);
  }

  get webPushSubscriptionAuth(): string {
    return this.props.webPushSubscriptionAuth;
  }

  set webPushSubscriptionAuth(value: string) {
    this.props.webPushSubscriptionAuth = value;
  }

  get webPushSubscriptionP256dh(): string {
    return this.props.webPushSubscriptionP256dh;
  }

  set webPushSubscriptionP256dh(value: string) {
    this.props.webPushSubscriptionP256dh = value;
  }

  get endpoint(): string {
    return this.props.endpoint;
  }

  get subscriberId(): string {
    return this.props.subscriberId;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
