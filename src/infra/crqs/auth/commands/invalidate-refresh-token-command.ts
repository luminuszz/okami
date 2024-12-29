import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvalidateRefreshToken } from '@domain/auth/application/useCases/invalidate-refresh-token';

export class InvalidateRefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(InvalidateRefreshTokenCommand)
export class InvalidateRefreshTokenCommandHandler implements ICommandHandler<InvalidateRefreshTokenCommand> {
  constructor(private readonly stu: InvalidateRefreshToken) {}

  async execute(command: InvalidateRefreshTokenCommand): Promise<void> {
    const results = await this.stu.execute({ refreshToken: command.refreshToken });

    if (results.isLeft()) {
      throw results.value;
    }
  }
}
