export class SameChapterError extends Error {
  constructor() {
    super('New chapter must be greater than current chapter');
    this.name = 'SameChapterError';
  }
}
