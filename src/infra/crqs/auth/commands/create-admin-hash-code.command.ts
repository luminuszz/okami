import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetAdminHashCodeKeyUseCase } from '@domain/auth/application/useCases/set-admin-hash-code-key';

export class CreateAdminHashCodeCommand {
  constructor(
    public readonly userId: string,
    public readonly hashCodeKey: string,
  ) {}
}

@CommandHandler(CreateAdminHashCodeCommand)
export class CreateAdminHashCodeCommandHandler implements ICommandHandler<CreateAdminHashCodeCommand> {
  constructor(private readonly setAdminHashCode: SetAdminHashCodeKeyUseCase) {}

  async execute({ hashCodeKey, userId }: CreateAdminHashCodeCommand): Promise<any> {
    const response = await this.setAdminHashCode.execute({ hashCodeKey, userId });

    if (response.isLeft()) {
      throw response.value;
    }
  }
}
