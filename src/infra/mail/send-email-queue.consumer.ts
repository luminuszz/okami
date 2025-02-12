import { QueueProvider } from '@domain/work/application/contracts/queueProvider'
import { ResendProvider } from '@infra/mail/resend.provider'
import { Injectable, OnModuleInit } from '@nestjs/common'

export interface SendEmailQueueConsumerDto {
  to: string
  subject: string
  text: string
  from: string
}

export const sendEmailQueueKey = 'send-email'

@Injectable()
export class SendEmailQueueConsumer implements OnModuleInit {
  constructor(
    private readonly queueProvider: QueueProvider,
    private readonly resend: ResendProvider,
  ) {}

  onModuleInit() {
    this.queueProvider.subscribe(sendEmailQueueKey, this.process.bind(this))
  }

  async process(payload: SendEmailQueueConsumerDto) {
    const { to, subject, text, from } = payload

    const { error } = await this.resend.emails.send({
      to,
      subject,
      text,
      from,
    })

    if (error) {
      throw new Error(`resend error ${error.name} - ${error.message} `)
    }
  }
}
