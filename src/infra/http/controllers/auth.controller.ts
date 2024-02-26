import { UpdateNotionDatabaseIdCommand } from '@app/infra/crqs/auth/commands/update-notion-database-id.command';
import { User } from '@app/infra/crqs/user-auth.decorator';
import { AuthGuard } from '@infra/crqs/auth/auth.guard';
import {
  CreateAccessTokenCommand,
  CreateAccessTokenCommandResponse,
} from '@infra/crqs/auth/commands/create-access-token.command';
import { CreateAdminHashCodeCommand } from '@infra/crqs/auth/commands/create-admin-hash-code.command';
import { LoginCommand } from '@infra/crqs/auth/commands/login.command';
import { ResetPasswordCommand } from '@infra/crqs/auth/commands/reset-password.command';
import { UploadUserImageUrlCommand } from '@infra/crqs/auth/commands/upload-user-image-url.command';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { FindUserByIdQuery } from '@infra/crqs/auth/queries/find-user-by-id.query';
import { AccessToken, TokenModel } from '@infra/http/models/token.model';
import { UserHttp, UserModel } from '@infra/http/models/user.model';
import { CreateAdminHashCodeDto } from '@infra/http/validators/create-admin-hash-code.dto';
import { MakeSessionDto } from '@infra/http/validators/make-session.dto';
import { ResetPasswordDto } from '@infra/http/validators/reset-password.dto';
import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { UpdateNotionDatabaseIdDto } from '../validators/update-notiton-database-id.dto';
import { CreateUserCommand } from '@app/infra/crqs/auth/commands/create-user.command';
import { CreateUserDto } from '../validators/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenModel })
  async makeSession(@Body() data: MakeSessionDto, @Res({ passthrough: true }) res: FastifyReply) {
    const { email, password } = data;

    const { token } = await this.commandBus.execute<unknown, { token: string }>(new LoginCommand(email, password));

    return res
      .setCookie('@okami-web:token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })
      .send()
      .status(201);
  }

  @UseGuards(AuthGuard)
  @Post('/user/avatar/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'object',
    schema: {
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatarImage(@Req() req: any) {
    if (!req.isMultipart()) {
      return new BadRequestException({
        message: 'Invalid file',
      });
    }

    const file = await req.file();

    const imageData = await file.toBuffer();

    const { id } = req.user as UserTokenDto;

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

    return UserModel.toHttp(results);
  }

  @UseGuards(AuthGuard)
  @Post('/access-token')
  @ApiCreatedResponse({ type: AccessToken })
  async createAccessToken(@Req() { user }: { user: UserTokenDto }) {
    const { accessToken } = await this.commandBus.execute<CreateAccessTokenCommand, CreateAccessTokenCommandResponse>(
      new CreateAccessTokenCommand(user.id),
    );

    return {
      accessToken,
    };
  }

  @Post('/register')
  async register(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply) {
    await this.commandBus.execute(
      new CreateUserCommand({ email: data.email, password: data.password, name: data.name }),
    );

    const sessionCreated = await this.commandBus.execute<unknown, { token: string }>(
      new LoginCommand(data.email, data.password),
    );

    return res
      .setCookie('@okami-web:token', sessionCreated.token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })
      .send()
      .status(201);
  }

  @UseGuards(AuthGuard)
  @Post('/admin-hash-code')
  async createAdminHashCode(@Req() @Req() { user }: { user: UserTokenDto }, @Body() data: CreateAdminHashCodeDto) {
    await this.commandBus.execute(new CreateAdminHashCodeCommand(user.id, data.hashCodeKey));
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    await this.commandBus.execute(new ResetPasswordCommand(data.email, data.newPassword, data.adminHashCode));
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    return res.clearCookie('@okami-web:token').status(201).send();
  }

  @Post('login-mobile')
  async createMobileSession(@Body() data: MakeSessionDto) {
    const { token } = await this.commandBus.execute<unknown, { token: string }>(
      new LoginCommand(data.email, data.password),
    );

    return {
      token,
    };
  }

  @Post('notion/update-database-id')
  async updateNotionDatabaseId(@Body() { notionDatabaseId }: UpdateNotionDatabaseIdDto, @User('id') userId: string) {
    await this.commandBus.execute(new UpdateNotionDatabaseIdCommand(userId, notionDatabaseId));
  }
}
