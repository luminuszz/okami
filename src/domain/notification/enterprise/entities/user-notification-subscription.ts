import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export enum NotificationType {
  PUSH = 'browser-push',
  mobile = 'mobile-push',
}

interface UserNotificationSubscriptionProps {
  subscriptionId: string;
  userId: string;
  notificationType: NotificationType;

  createdAt?: Date;
}

export class UserNotificationSubscription extends Entity<UserNotificationSubscriptionProps> {
  private constructor(props: UserNotificationSubscriptionProps, id?: UniqueEntityID) {
    super(props, id);
    props.createdAt = props.createdAt ?? new Date();
  }

  get subscriptionId(): string {
    return this.props.subscriptionId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: UserNotificationSubscriptionProps, id?: UniqueEntityID) {
    return new UserNotificationSubscription(props, id);
  }
}
