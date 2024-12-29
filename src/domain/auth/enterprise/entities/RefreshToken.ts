import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Replace } from '@core/replaced';
import dayJs from 'dayjs';
import dayjs from 'dayjs';

export interface RefreshTokenProps {
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  invalidatedAt: Date | null;
}

type RefreshTokenPropsForReplace = Replace<
  RefreshTokenProps,
  {
    createdAt?: Date;
    invalidatedAt?: Date;
  }
>;

export class RefreshToken extends Entity<RefreshTokenProps> {
  private constructor(props: RefreshTokenPropsForReplace, id?: UniqueEntityID) {
    props.createdAt = props.createdAt ?? new Date();
    props.invalidatedAt = props.invalidatedAt ?? null;

    super(props as RefreshTokenProps, id);
  }

  get token(): string {
    return this.props.token;
  }

  get userId(): string {
    return this.props.userId;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get isExpired() {
    return dayJs(this.props.expiresAt).isBefore(dayjs());
  }

  invalidate(): void {
    this.props.invalidatedAt = new Date();
  }

  get invalidatedAt(): Date | null {
    return this.props.invalidatedAt;
  }

  get isInvalidated(): boolean {
    return this.props.invalidatedAt !== null;
  }

  public static create(props: RefreshTokenPropsForReplace, id?: UniqueEntityID): RefreshToken {
    return new RefreshToken(props, id);
  }
}
