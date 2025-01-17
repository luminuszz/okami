import { EXPIRE_AUTH_TOKEN } from '@app/infra/utils/constants'
import { FindUserByIdUseCase } from '@domain/auth/application/useCases/find-user-by-id'
import { ValidateRefreshToken } from '@domain/auth/application/useCases/validate-refresh-token'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { TokenService } from '../token.service'

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

export interface RefreshTokenCommandResponse {
  token: string
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand, RefreshTokenCommandResponse> {
  constructor(
    private readonly validateRefreshToken: ValidateRefreshToken,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly tokenService: TokenService,
  ) {}

  async execute({ refreshToken }: RefreshTokenCommand): Promise<RefreshTokenCommandResponse> {
    const results = await this.validateRefreshToken.execute({ refreshToken })

    if (results.isLeft()) {
      throw results.value
    }

    const { refreshToken: validatedRefreshToken } = results.value

    const userResults = await this.findUserById.execute({ id: validatedRefreshToken.userId })

    if (userResults.isLeft()) {
      throw userResults.value
    }

    const { user } = userResults.value

    const token = await this.tokenService.generateUserToken(
      { email: user.email, id: user.id, name: user.name, notionDatabaseId: user?.notionDatabaseId },
      {
        expiresIn: EXPIRE_AUTH_TOKEN,
      },
    )

    return {
      token,
    }
  }
}
