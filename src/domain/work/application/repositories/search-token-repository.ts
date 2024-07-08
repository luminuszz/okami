import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';

export abstract class SearchTokenRepository {
  abstract create(data: SearchToken): Promise<void>;
  abstract createMany(data: SearchToken[]): Promise<void>;
  abstract fetchByType(type: SearchTokenType): Promise<SearchToken[]>;
}
