import { Entity } from '@core/entities/entity';
import { Replace } from '@core/replaced';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export enum SearchTokenType {
  ANIME = 'ANIME',
  MANGA = 'MANGA',
}

export interface SearchTokenProps {
  token: string;
  createdAt: Date;
  type: SearchTokenType;
}

type ReplacedSearchTokenProps = Replace<SearchTokenProps, { createdAt?: Date }>;

export class SearchToken extends Entity<SearchTokenProps> {
  private constructor(props: ReplacedSearchTokenProps, id?: UniqueEntityID) {
    super(
      {
        token: props.token,
        createdAt: props.createdAt ?? new Date(),
        type: props.type,
      },
      id,
    );
  }

  get token() {
    return this.props.token;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get type() {
    return this.props.type;
  }

  public static create(props: ReplacedSearchTokenProps, id?: UniqueEntityID): SearchToken {
    return new SearchToken(props, id);
  }
}
