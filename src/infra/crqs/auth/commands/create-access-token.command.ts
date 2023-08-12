import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';

export class CreateAccessTokenCommand {
  constructor(public readonly user_id: string) {}
}

export class CreateAccessTokenCommandResponse {
  public readonly token: string;
}

@CommandHandler(CreateAccessTokenCommand)
export class CreateAccessTokenCommandHandler
  implements ICommandHandler<CreateAccessTokenCommand, CreateAccessTokenCommandResponse>
{
  constructor(private readonly createAccessToken: CreateApiAccessTokenUseCase) {}

  async execute({ user_id }: CreateAccessTokenCommand): Promise<CreateAccessTokenCommandResponse> {
    const results = await this.createAccessToken.execute({
      user_id,
    });

    if (results.isLeft()) {
      throw results.value;
    }

    const { accessToken } = results.value;

    return {
      token: accessToken.token,
    };
  }
}
