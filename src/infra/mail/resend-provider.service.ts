import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { Resend } from 'resend';
import {
  MailProvider,
  SendConfirmEmailDto,
  SendResetPasswordEmailDto,
} from '@domain/auth/application/contracts/mail-provider';

@Injectable()
export class ResendEmailProviderService implements MailProvider {
  private resend: Resend;

  constructor(private readonly env: EnvService) {
    this.resend = new Resend(env.get('RESEND_API_SECRET_KEY'));
  }

  async sendConfirmEmail({ email, confirmEmailCode }: SendConfirmEmailDto): Promise<void> {
    await this.resend.emails.send({
      to: email,
      subject: "'Okami Platform'",
      text: `
        Olá, você se cadastrou na plataforma Okami.
        use o código abaixo para confirmar seu email
        ${confirmEmailCode}
      `,
      from: 'Okami Platform <okami@okami-mail.daviribeiro.com>',
    });
  }

  async sendResetPasswordEmail({ email, resetPasswordCode }: SendResetPasswordEmailDto): Promise<void> {
    const resetPasswordUrl = `${this.env.get('FRONT_END_URL_RESET_PASSWORD_URL')}/${resetPasswordCode}`;

    const { error } = await this.resend.emails.send({
      to: email,
      subject: "'Okami Platform'",
      text: `
        Olá, você solicitou a recuperação de senha para a plataforma Okami.
        use o link abaixo
        ${resetPasswordUrl}
      `,
      from: 'Okami Platform <okami@okami-mail.daviribeiro.com>',
    });

    if (error) {
      throw new Error(`resend error ${error.name} - ${error.message} `);
    }
  }
}
