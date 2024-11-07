import { Entity } from '@core/entities/entity';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Replace } from '@core/replaced';

export interface RefreshTokenProps {
  token: string;
  userId: string;
  expiresAt: number;

  createdAt: Date;
}

type RefreshTokenPropsForReplace = Replace<
  RefreshTokenProps,
  {
    createdAt?: Date;
  }
>;

export class RefreshToken extends Entity<RefreshTokenProps> {
  private constructor(props: RefreshTokenPropsForReplace, id?: UniqueEntityID) {
    props.createdAt = props.createdAt ?? new Date();

    super(props as RefreshTokenProps, id);
  }

  get token(): string {
    return this.props.token;
  }

  get userId(): string {
    return this.props.userId;
  }

  get expiresAt(): number {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: RefreshTokenPropsForReplace, id?: UniqueEntityID): RefreshToken {
    return new RefreshToken(props, id);
  }
}
