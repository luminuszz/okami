import { MailProvider } from '@domain/auth/application/contracts/mail-provider'
import { ResendProvider } from '@infra/mail/resend.provider'
import { SendEmailQueueConsumer } from '@infra/mail/send-email-queue.consumer'
import { QueueModule } from '@infra/queue/queue.module'
import { Module, Provider } from '@nestjs/common'
import { EmailService } from './email.service'

@Module({
  imports: [QueueModule],
  providers: [
    SendEmailQueueConsumer,
    ResendProvider,
    {
      provide: MailProvider,
      useClass: EmailService,
    },
  ],

  exports: [MailProvider],
})
export class MailModule {}
