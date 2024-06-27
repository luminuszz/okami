export class UserEmailAlreadyConfirmed extends Error {
  constructor() {
    super('User email already confirmed');
  }
}
