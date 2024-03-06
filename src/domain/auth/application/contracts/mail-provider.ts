export interface SendResetPasswordEmailDto {
  email: string;
  resetPasswordCode: string;
}

export abstract class MailProvider {
  abstract sendResetPasswordEmail(data: SendResetPasswordEmailDto): Promise<void>;
}
