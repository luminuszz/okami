export class InvalidOperation extends Error {
  constructor(error?: string) {
    super(error ?? `Invalid operation`);
  }
}
