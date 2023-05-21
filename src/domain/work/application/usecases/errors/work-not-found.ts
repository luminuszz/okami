export class WorkNotFoundError extends Error {
  constructor() {
    super('Work not found');
    this.name = 'WorkNotFound';
  }
}
