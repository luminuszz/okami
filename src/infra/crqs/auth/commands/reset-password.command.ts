import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetUserPasswordByAdminCodeKey } from '@domain/auth/application/useCases/reset-user-password-by-admin-code-key';

export class ResetPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly newPassword: string,
    public readonly adminCodeKey: string,
  ) {}
}

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(private resetPasswordByAdminHashCode: ResetUserPasswordByAdminCodeKey) {}

  async execute({ newPassword, adminCodeKey, email }: ResetPasswordCommand): Promise<any> {
    const results = await this.resetPasswordByAdminHashCode.execute({
      newPassword,
      adminCodeKey,
      email,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
