import {
  MailProvider,
  SendConfirmEmailDto,
  SendEmailDto,
  SendResetPasswordEmailDto,
} from '@domain/auth/application/contracts/mail-provider'
import { QueueProvider } from '@domain/work/application/contracts/queueProvider'
import { SendEmailQueueConsumerDto, sendEmailQueueKey } from '@infra/mail/send-email-queue.consumer'
import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { EnvService } from '../env/env.service'

@Injectable()
export class EmailService implements MailProvider {
  constructor(
    private readonly queue: QueueProvider,
    private readonly env: EnvService,
  ) {}

  private readonly from = 'Okami Platform <okami@okami-mail.daviribeiro.com>'

  async publishInEmailQueue(payload: SendEmailQueueConsumerDto): Promise<void> {
    await this.queue.publish<SendEmailQueueConsumerDto>(sendEmailQueueKey, payload)
  }

  async sendMail({ body, subject, to }: SendEmailDto): Promise<void> {
    await this.queue.publish(sendEmailQueueKey, {
      to: to,
      subject: subject,
      text: body,
      from: this.from,
    })
  }

  async sendResetPasswordEmail({ email, resetPasswordCode }: SendResetPasswordEmailDto): Promise<void> {
    const resetPasswordUrl = `${this.env.get('FRONT_END_URL_RESET_PASSWORD_URL')}/${resetPasswordCode}`

    await this.publishInEmailQueue({
      to: email,
      subject: 'Okami Platform',
      text: `
        Olá, você solicitou a recuperação de senha para a plataforma Okami.
        use o link abaixo
        ${resetPasswordUrl}
      `,
      from: this.from,
    })
  }

  async sendConfirmEmail({ confirmEmailCode, email }: SendConfirmEmailDto): Promise<void> {
    const confirmEmailUrl = `${this.env.get('FRONT_END_URL_CONFIRM_EMAIL')}/${confirmEmailCode}`

    await this.publishInEmailQueue({
      to: email,
      subject: 'Okami Platform',
      text: `
        Olá, confirme seu e-mail para a plataforma Okami.
        ${confirmEmailUrl}
      `,
      from: this.from,
    })
  }
}
