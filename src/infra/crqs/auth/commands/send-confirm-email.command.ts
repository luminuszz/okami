import { SendConfirmEmail } from '@domain/auth/application/useCases/send-confirm-email';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class SendConfirmEmailCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(SendConfirmEmailCommand)
export class SendConfirmEmailCommandHandler implements ICommandHandler<SendConfirmEmailCommand> {
  constructor(private readonly sendConfirmEmail: SendConfirmEmail) {}

  async execute({ userId }: SendConfirmEmailCommand) {
    const results = await this.sendConfirmEmail.execute({ userId });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
