import { UseCaseError } from '@core/entities/use-case-error';

export class TagNotFoundException extends UseCaseError {
  constructor() {
    super('Tag not found');
    this.name = 'TagNotFound';
  }
}

export class TagAlreadyExistsException extends UseCaseError {
  constructor() {
    super('Tag already exists');
    this.name = 'TagAlreadyExists';
  }
}
