import { SearchToken } from '@domain/work/enterprise/entities/search-token';

export abstract class SearchTokenRepository {
  abstract create(data: SearchToken): Promise<void>;
}
