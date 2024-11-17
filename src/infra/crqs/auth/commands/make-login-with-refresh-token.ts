import { EnvService } from '@app/infra/env/env.service';
import { AuthenticateUserUseCase } from '@domain/auth/application/useCases/authenticate-user';
import { CreateRefreshTokenUseCase } from '@domain/auth/application/useCases/create-refresh-token';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from '../dto/user-token.dto';

export class MakeLoginWithRefreshTokenCommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}

export interface CreateRefreshTokenCommandResponse {
  refreshToken: string;
  token: string;
}

@CommandHandler(MakeLoginWithRefreshTokenCommand)
export class MakeLoginWithRefreshTokenCommandHandler
  implements ICommandHandler<MakeLoginWithRefreshTokenCommand, CreateRefreshTokenCommandResponse>
{
  constructor(
    private createRefreshToken: CreateRefreshTokenUseCase,
    private readonly authUser: AuthenticateUserUseCase,
    private readonly jwtService: JwtService,
    private env: EnvService,
  ) {}

  async execute({ email, password }: MakeLoginWithRefreshTokenCommand): Promise<CreateRefreshTokenCommandResponse> {
    const results = await this.authUser.execute({ email, password });

    if (results.isLeft()) {
      throw results.value;
    }

    const { user } = results.value;

    const refreshTokenResults = await this.createRefreshToken.execute({ userId: user.id });

    if (refreshTokenResults.isLeft()) {
      throw results.value;
    }

    const { token: refreshToken } = refreshTokenResults.value;

    const payload: UserTokenDto = {
      email: user.email,
      id: user.id,
      name: user.name,
      notionDatabaseId: user?.notionDatabaseId,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.env.get('JWT_SECRET'),
      expiresIn: '30m',
    });

    return {
      refreshToken,
      token,
    };
  }
}
