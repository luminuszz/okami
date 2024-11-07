import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';

export abstract class RefreshTokenRepository {
  abstract create(refreshToken: RefreshToken): Promise<void>;
  abstract findByToken(token: string): Promise<RefreshToken | null>;
}
