import dayjs from 'dayjs';

export class EmailValidationCode {
  private code: string | null;
  private emailIsValidated: boolean;
  private emailValidationCodeExpirationAt: Date | null;

  constructor(code: string, emailIsValidated?: boolean, emailValidationCodeExpirationAt?: Date) {
    this.code = code;
    this.emailIsValidated = emailIsValidated ?? false;
    this.emailValidationCodeExpirationAt = emailValidationCodeExpirationAt ?? new Date();
  }

  public validateEmail(): void {
    if (this.isExpired()) {
      throw new Error('code expired');
    }

    this.emailIsValidated = true;
    this.code = null;
    this.emailValidationCodeExpirationAt = null;
  }

  public getCode(): string {
    return this.code;
  }

  public isEmailValidated(): boolean {
    return this.emailIsValidated;
  }

  public getEmailValidationCodeExpirationAt() {
    return this.emailValidationCodeExpirationAt;
  }

  public isExpired(): boolean {
    return dayjs(this.emailValidationCodeExpirationAt).isBefore(new Date());
  }
}
