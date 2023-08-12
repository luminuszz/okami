import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface AccessTokenProps {
  userId: string;
  token: string;
  revokedAt?: Date | null;
  createdAt: Date;
}

export class AccessToken extends Entity<AccessTokenProps> {
  private constructor(props: AccessTokenProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  set token(token: string) {
    this.props.token = token;
  }

  get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  set revokedAt(date: Date) {
    this.props.revokedAt = date;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: AccessTokenProps, id?: UniqueEntityID): AccessToken {
    props.createdAt = props.createdAt || new Date();
    props.revokedAt = props.revokedAt || null;

    return new AccessToken(props, id);
  }
}
