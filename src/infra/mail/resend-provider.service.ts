import {
  MailProvider,
  SendConfirmEmailDto,
  SendEmailDto,
  SendResetPasswordEmailDto,
} from '@domain/auth/application/contracts/mail-provider';
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { EnvService } from '../env/env.service';

@Injectable()
export class ResendEmailProviderService implements MailProvider {
  private resend: Resend;

  constructor(private readonly env: EnvService) {
    this.resend = new Resend(env.get('RESEND_API_SECRET_KEY'));
  }

  async sendMail({ body, subject, to }: SendEmailDto): Promise<void> {
    const { error } = await this.resend.emails.send({
      to: to,
      subject: subject,
      text: body,
      from: 'Okami Platform <okami@okami-mail.daviribeiro.com>',
    });

    if (error) {
      throw new Error(`resend error ${error.name} - ${error.message} `);
    }
  }

  private readonly from = 'Okami Platform <okami@okami-mail.daviribeiro.com>';

  async sendResetPasswordEmail({ email, resetPasswordCode }: SendResetPasswordEmailDto): Promise<void> {
    const resetPasswordUrl = `${this.env.get('FRONT_END_URL_RESET_PASSWORD_URL')}/${resetPasswordCode}`;

    const { error } = await this.resend.emails.send({
      to: email,
      subject: 'Okami Platform',
      text: `
        Olá, você solicitou a recuperação de senha para a plataforma Okami.
        use o link abaixo
        ${resetPasswordUrl}
      `,
      from: this.from,
    });

    if (error) {
      throw new Error(`resend error ${error.name} - ${error.message} `);
    }
  }

  async sendConfirmEmail({ confirmEmailCode, email }: SendConfirmEmailDto): Promise<void> {
    const confirmEmailUrl = `${this.env.get('FRONT_END_URL_CONFIRM_EMAIL')}/${confirmEmailCode}`;

    const { error } = await this.resend.emails.send({
      to: email,
      subject: 'Okami Platform',
      text: `
        Olá, confirme seu e-mail para a plataforma Okami.
        ${confirmEmailUrl}
      `,
      from: this.from,
    });

    if (error) {
      throw new Error(`resend error ${error.name} - ${error.message} `);
    }
  }
}
