import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Subscriber } from './subscriber';
import { Entity } from '@core/entities/entity';

interface ChanelProps {
  name: string;
  description: string;
  subscribers: Subscriber[];
  createdAt?: Date;
}

export class Channel extends Entity<ChanelProps> {
  private constructor(props: ChanelProps, id?: UniqueEntityID) {
    super(props, id);
    this.props.createdAt = props.createdAt || new Date();
    this.props.subscribers = props.subscribers || [];
  }

  public static create(props: ChanelProps, id?: UniqueEntityID): Channel {
    return new Channel(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  addSubscriber(subscriber: Subscriber): void {
    this.props.subscribers?.push(subscriber);
  }

  get subscribers(): Subscriber[] {
    return this.props.subscribers;
  }
}
