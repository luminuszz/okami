import * as dayjs from 'dayjs';

export class EmailValidationCode {
  private code: string | null;
  private emailIsValidated: boolean;
  private emailValidationCodeExpirationAt: Date | null;

  constructor(code: string, emailIsValidated?: boolean, emailValidationCodeExpirationAt?: Date) {
    this.code = code ?? null;
    this.emailIsValidated = emailIsValidated ?? false;
    this.emailValidationCodeExpirationAt = emailValidationCodeExpirationAt ?? new Date();
  }

  public validateEmail(): void {
    if (this.isExpired()) {
      throw new Error('Email validation code is expired');
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

  public isExpired(): boolean {
    return dayjs(this.emailValidationCodeExpirationAt).isBefore(new Date());
  }
}
