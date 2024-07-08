import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';
import { SearchToken } from '@domain/work/enterprise/entities/search-token';

export class InMemorySearchTokenRepository implements SearchTokenRepository {
  public searchTokens: SearchToken[] = [];

  async create(data: SearchToken): Promise<void> {
    this.searchTokens.push(data);
  }
}
