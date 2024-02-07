import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export enum NotificationType {
  BROWSER = 'BROWSER',
  MOBILE = 'MOBILE',
}

interface UserNotificationSubscriptionProps {
  subscriptionId: string;
  userId: string;
  notificationType: NotificationType;
  credentials?: Record<string, any>;

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

  get credentials(): Record<string, any> {
    return this.props.credentials;
  }

  get notificationType() {
    return this.props.notificationType;
  }

  static create(props: UserNotificationSubscriptionProps, id?: UniqueEntityID) {
    return new UserNotificationSubscription(props, id);
  }
}
