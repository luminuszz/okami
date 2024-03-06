import { CreateUserCommand } from '@app/infra/crqs/auth/commands/create-user.command';
import { UpdateNotionDatabaseIdCommand } from '@app/infra/crqs/auth/commands/update-notion-database-id.command';
import { FetchUserAnalyticsQuery } from '@app/infra/crqs/auth/queries/fetch-user-analytics';
import { User } from '@app/infra/crqs/user-auth.decorator';
import { MessageService } from '@app/infra/messaging/messaging-service';
import { GetUserTrialQuote } from '@domain/auth/application/useCases/get-user-trial-quote';
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
import { BadRequestException, Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../validators/create-user.dto';
import { UpdateNotionDatabaseIdDto } from '../validators/update-notiton-database-id.dto';
import { SendResetPasswordEmailCommand } from '@app/infra/crqs/auth/commands/send-reset-password-emai.command';
import { SendResetPasswordEmailDto } from '../validators/send-reset-password-email.dto';
import { ResetUserPasswordDto } from '../validators/reset-user-password.dto';
import { ResetUserPasswordCommand } from '@app/infra/crqs/auth/commands/reset-user-passsword.command';
import { UpdateUserCommand } from '@app/infra/crqs/auth/commands/update-user.command';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly getUserTrialQuote: GetUserTrialQuote,
    private readonly notificationService: MessageService,
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
      type: 'file',
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

  @UseGuards(AuthGuard)
  @Get('user/analytics')
  async fetchUserAnalytics(@User('id') userId: string) {
    return await this.queryBus.execute(new FetchUserAnalyticsQuery(userId));
  }

  @UseGuards(AuthGuard)
  @Get('user/trial-quote')
  async getUserTrialQuoteGet(@User('id') userId: string) {
    const response = await this.getUserTrialQuote.execute({ userId });

    if (response.isLeft()) {
      throw new BadRequestException(response.value);
    }

    return response.value;
  }

  @UseGuards(AuthGuard)
  @Get('/user/telegram-status')
  async getTelegramStatus(@User('id') userId: string) {
    try {
      const response = await firstValueFrom(this.notificationService.send('get-subscriber', { recipientId: userId }), {
        defaultValue: null,
      });

      const { telegramChatId } = response as { telegramChatId: string };

      return {
        isSubscribed: !!telegramChatId,
      };
    } catch (e) {
      throw new BadRequestException('Houve um erro');
    }
  }

  @Post('/password/send-reset-email')
  async sendResetPasswordEmail(@Body() { email }: SendResetPasswordEmailDto) {
    await this.commandBus.execute(new SendResetPasswordEmailCommand(email));
  }

  @Post('/password/reset')
  async resetUserPassword(@Body() { code, newPassword }: ResetUserPasswordDto) {
    await this.commandBus.execute(new ResetUserPasswordCommand(code, newPassword));
  }

  @UseGuards(AuthGuard)
  @Put('/user')
  async updateUser(@User('id') userId: string, @Body() data: { name: string; email: string }) {
    await this.commandBus.execute(new UpdateUserCommand(userId, data));
  }
}
