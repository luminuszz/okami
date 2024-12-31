import { UseCaseError } from '@core/entities/use-case-error';

export class InvalidCalendarOperation extends UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Invalid Calendar Operation');
  }
}
