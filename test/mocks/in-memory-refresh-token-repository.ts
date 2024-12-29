import { RefreshTokenRepository } from '@domain/auth/application/useCases/repositories/refresh-token-repository';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { merge } from 'lodash';

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  async save(refreshToken: RefreshToken): Promise<void> {
    const index = this.refreshTokens.findIndex((item) => item.id === refreshToken.id);

    this.refreshTokens[index] = merge(this.refreshTokens[index], refreshToken);
  }
  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = this.refreshTokens.find((refreshToken) => refreshToken.token === token);

    return refreshToken || null;
  }
  refreshTokens: RefreshToken[] = [];

  async create(refreshToken: RefreshToken): Promise<void> {
    this.refreshTokens.push(refreshToken);
  }
}
