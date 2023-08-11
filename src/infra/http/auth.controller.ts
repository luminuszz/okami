import { BadRequestException, Body, Controller, Param, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '@infra/http/validators/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@infra/crqs/auth/commands/create-user.command';
import { LoginCommand } from '@infra/crqs/auth/commands/login.command';
import { MakeSessionDto } from '@infra/http/validators/make-session.dto';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import { UploadUserImageUrlCommand } from '@infra/crqs/auth/commands/upload-user-image-url.command';

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

  @Post('avatar/upload/:id')
  async uploadAvatarImage(@Param('id', ParseObjectIdPipe) id: string, @Req() req: any) {
    if (!req.isMultipart()) {
      return new BadRequestException({
        message: 'Invalid file',
      });
    }

    const file = await req.file();

    const imageData = await file.toBuffer();

    await this.commandBus.execute(
      new UploadUserImageUrlCommand({
        imageFile: imageData,
        imageType: file.filename.split('.').pop(),
        userId: id,
      }),
    );
  }
}
