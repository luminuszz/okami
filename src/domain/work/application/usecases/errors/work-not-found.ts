import { UseCaseError } from '@core/entities/use-case-error';

export class WorkNotFoundError extends UseCaseError {
  constructor() {
    super('Work not found');
    this.name = 'WorkNotFound';
  }
}
