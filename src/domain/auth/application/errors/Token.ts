export class TokenNotFoundError extends Error {
  constructor() {
    super('Token not found');
    this.name = 'TokenNotFoundError';
  }
}

export class TokenRevokedError extends Error {
  constructor() {
    super('Token revoked');
    this.name = 'TokenRevokedError';
  }
}
