export interface SendEmailDto {
  to: string;
  subject: string;
  body: string;
}

export abstract class MailProvider {
  abstract sendMail(payload: SendEmailDto): Promise<void>;
}
