export class ResourceNotFound extends Error {
  constructor(resource: string) {
    super(`Resource ${resource} not found`);
  }
}
