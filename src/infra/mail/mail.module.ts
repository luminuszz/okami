import { MailProvider } from '@domain/auth/application/contracts/mail-provider';
import { Module } from '@nestjs/common';
import { ResendEmailProviderService } from './resend-provider.service';

@Module({
  providers: [
    {
      provide: MailProvider,
      useClass: ResendEmailProviderService,
    },
  ],

  exports: [MailProvider],
})
export class MailModule {}
