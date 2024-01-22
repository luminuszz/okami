export class InvalidWorkOperationError extends Error {
  constructor(message: string = '') {
    super(`Invalid work operation ${message} `);
  }
}
