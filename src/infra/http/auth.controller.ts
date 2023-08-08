import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@infra/http/validators/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@infra/crqs/auth/commands/create-user.command';
import { LoginCommand } from '@infra/crqs/auth/commands/login.command';
import { MakeSessionDto } from '@infra/http/validators/make-session.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async createUser(@Body() data: CreateUserDto) {
    await this.commandBus.execute(new CreateUserCommand(data));
  }

  @Post('login')
  async makeSession(@Body() { password, email }: MakeSessionDto) {
    const { token } = await this.commandBus.execute<unknown, { token: string }>(new LoginCommand(email, password));

    return {
      token,
    };
  }
}
