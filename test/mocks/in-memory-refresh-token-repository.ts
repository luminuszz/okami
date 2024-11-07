import { RefreshTokenRepository } from '@domain/auth/application/useCases/repositories/refresh-token-repository';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = this.refreshTokens.find((refreshToken) => refreshToken.token === token);

    return refreshToken || null;
  }
  refreshTokens: RefreshToken[] = [];

  async create(refreshToken: RefreshToken): Promise<void> {
    this.refreshTokens.push(refreshToken);
  }
}
