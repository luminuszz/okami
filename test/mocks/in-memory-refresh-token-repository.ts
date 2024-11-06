import { RefreshTokenRepository } from '@domain/auth/application/useCases/repositories/refresh-token-repository';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  refreshTokens: RefreshToken[] = [];

  async create(refreshToken: RefreshToken): Promise<void> {
    this.refreshTokens.push(refreshToken);
  }
}
