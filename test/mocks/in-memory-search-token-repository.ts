import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';
import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';

export class InMemorySearchTokenRepository implements SearchTokenRepository {
  public searchTokens: SearchToken[] = [];

  async createMany(data: SearchToken[]): Promise<void> {
    this.searchTokens.push(...data);
  }

  async create(data: SearchToken): Promise<void> {
    this.searchTokens.push(data);
  }

  async fetchByType(type: SearchTokenType): Promise<SearchToken[]> {
    return this.searchTokens.filter((searchToken) => searchToken.type === type);
  }

  async findById(id: string): Promise<SearchToken> {
    return this.searchTokens.find((searchToken) => searchToken.id === id);
  }

  async delete(id: string): Promise<void> {
    const index = this.searchTokens.findIndex((searchToken) => searchToken.id === id);

    if (index !== -1) {
      this.searchTokens.splice(index, 1);
    }
  }
}
