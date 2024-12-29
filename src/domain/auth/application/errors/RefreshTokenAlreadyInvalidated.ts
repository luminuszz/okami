import { UseCaseError } from '@core/entities/use-case-error';

export class RefreshTokenAlreadyInvalidated extends UseCaseError {
  constructor() {
    super('Refresh token already invalidated');
  }
}
