import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateEmailCode } from '@domain/auth/application/useCases/validate-email-code';

export class ValidateEmailCodeCommand {
  constructor(
    public readonly userId: string,
    public readonly code: string,
  ) {}
}

@CommandHandler(ValidateEmailCodeCommand)
export class ValidateEmailCodeCommandHandler implements ICommandHandler<ValidateEmailCodeCommand> {
  constructor(private readonly validateCodeEmailUseCase: ValidateEmailCode) {}

  async execute({ code, userId }: ValidateEmailCodeCommand) {
    const results = await this.validateCodeEmailUseCase.execute({
      code,
      id: userId,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
