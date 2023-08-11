import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface EntityProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatarImageId?: string;
}

export class User extends Entity<EntityProps> {
  private constructor(props: Omit<EntityProps, 'updatedAt'>, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get name(): string {
    return this.props.name;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get avatarImageId(): string {
    return this.props.avatarImageId;
  }

  set avatarImageId(url: string) {
    this.props.avatarImageId = url;
  }

  public static create(props: EntityProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }
}
