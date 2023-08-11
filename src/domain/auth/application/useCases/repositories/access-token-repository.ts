import { AccessToken } from '@domain/auth/enterprise/entities/AccessToken';

export abstract class AccessTokenRepository {
  abstract create(accessToken: AccessToken): Promise<void>;
  abstract findByToken(token: string): Promise<AccessToken | undefined>;
}
