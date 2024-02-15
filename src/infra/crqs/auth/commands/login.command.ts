import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticateUserUseCase } from '@domain/auth/application/useCases/authenticate-user';
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { ConfigService } from '@nestjs/config';
import { EnvSecrets } from '@infra/utils/getSecretsEnv';

export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authUser: AuthenticateUserUseCase,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvSecrets>,
  ) {}

  async execute({ password, email }: LoginCommand): Promise<{ token: string }> {
    const result = await this.authUser.execute({ password, email });

    if (result.isLeft()) {
      throw result.value;
    }

    const { user } = result.value;

    const payload: UserTokenDto = {
      email: user.email,
      id: user.id,
      name: user.name,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      token,
    };
  }
}
