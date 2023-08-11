import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '@infra/http/validators/create-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@infra/crqs/auth/commands/create-user.command';
import { LoginCommand } from '@infra/crqs/auth/commands/login.command';
import { MakeSessionDto } from '@infra/http/validators/make-session.dto';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import { UploadUserImageUrlCommand } from '@infra/crqs/auth/commands/upload-user-image-url.command';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { FindUserByIdQuery } from '@infra/crqs/auth/queries/find-user-by-id.query';
import { UserHttp, UserModel } from '@infra/http/presentation/user.model';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

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

  @Post('/user/avatar/upload/:id')
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

  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: UserHttp })
  @Get('user/me')
  async getMe(@Req() { user }: { user: UserTokenDto }) {
    const results = await this.queryBus.execute(new FindUserByIdQuery(user.id));

    console.log({
      results,
    });

    return UserModel.toHttp(results);
  }
}
