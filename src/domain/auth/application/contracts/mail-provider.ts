export interface SendResetPasswordEmailDto {
  email: string;
  resetPasswordCode: string;
}

export interface SendConfirmEmailDto {
  email: string;
  confirmEmailCode: string;
}

export abstract class MailProvider {
  abstract sendResetPasswordEmail(data: SendResetPasswordEmailDto): Promise<void>;
  abstract sendConfirmEmail(data: SendConfirmEmailDto): Promise<void>;
}
