import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { AccessToken } from '@domain/auth/enterprise/entities/AccessToken';

export class InMemoryAccessTokenRepository implements AccessTokenRepository {
  public tokens: AccessToken[] = [];

  async create(user: AccessToken): Promise<void> {
    this.tokens.push(user);
  }

  async findByToken(token: string): Promise<AccessToken | undefined> {
    return this.tokens.find((accessToken) => accessToken.token === token);
  }
}
