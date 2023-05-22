import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Content } from '../values-objects/content';

interface NotificationProps {
  content: Content;
  recipientId: string;
  createdAt?: Date;
  readAt?: Date | null;
}

export class Notification extends Entity<NotificationProps> {
  private constructor(props: NotificationProps, id?: UniqueEntityID) {
    super(props, id);

    props.readAt = props.readAt ?? null;
    props.createdAt = props.createdAt ?? new Date();
  }

  static create(props: NotificationProps, id?: UniqueEntityID) {
    const notification = new Notification(props, id);

    return notification;
  }

  get recipientId(): string {
    return this.props.recipientId;
  }

  get content(): Content {
    return this.props.content;
  }

  get readAt(): Date | null {
    return this.props.readAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  setRecipientId(recipientId: string): void {
    this.props.recipientId = recipientId;
  }

  setReadAt(readAt: Date): void {
    this.props.readAt = readAt;
  }
}
