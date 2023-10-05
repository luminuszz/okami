import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Work } from '@domain/work/enterprise/entities/work';

interface EntityProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatarImageId?: string;
  works?: Work[];
  readingWorksCount?: number;
  finishedWorksCount?: number;
}

export class User extends Entity<EntityProps> {
  private constructor(props: Omit<EntityProps, 'updatedAt'>, id?: UniqueEntityID) {
    super(props, id);

    this.props.createdAt = props.createdAt ?? new Date();
    this.props.works = props.works ?? [];
    this.props.readingWorksCount = props.readingWorksCount ?? 0;
    this.props.finishedWorksCount = props.finishedWorksCount ?? 0;
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

  get works(): Work[] {
    return this.props.works;
  }

  get readingWorksCount() {
    return this.props.readingWorksCount;
  }

  get finishedWorksCount() {
    return this.props.finishedWorksCount;
  }

  public static create(props: EntityProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }
}
