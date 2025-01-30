import { SendResetPasswordEmail } from '@domain/auth/application/useCases/send-reset-password-email'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

export class SendResetPasswordEmailCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(SendResetPasswordEmailCommand)
export class SendResetPasswordEmailCommandHandler implements ICommandHandler<SendResetPasswordEmailCommand> {
  constructor(private readonly sendResetPasswordEmail: SendResetPasswordEmail) {}

  async execute({ email }: SendResetPasswordEmailCommand): Promise<any> {
    const results = await this.sendResetPasswordEmail.execute({ email })

    if (results.isLeft()) {
      throw results.value
    }
  }
}
