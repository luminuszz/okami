import { ResetUserPassword } from '@domain/auth/application/useCases/reset-user-password';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ResetUserPasswordCommand {
  constructor(
    public readonly code: string,
    public readonly newPassword: string,
  ) {}
}

@CommandHandler(ResetUserPasswordCommand)
export class ResetUserPasswordCommandHandler implements ICommandHandler<ResetUserPasswordCommand> {
  constructor(private readonly resetUserPassword: ResetUserPassword) {}

  async execute({ code, newPassword }: ResetUserPasswordCommand): Promise<any> {
    const results = await this.resetUserPassword.execute({ resetPasswordCode: code, newPassword });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
