import { Entity } from '@core/entities/entity';
import { Replace } from '@core/replaced';

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
  private constructor(props: ReplacedSearchTokenProps) {
    super({
      token: props.token,
      createdAt: props.createdAt ?? new Date(),
      type: props.type,
    });
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

  public static create(props: ReplacedSearchTokenProps): SearchToken {
    return new SearchToken(props);
  }
}
