import { CreateUserCommand } from '@app/infra/crqs/auth/commands/create-user.command'
import {
  CreateRefreshTokenCommandResponse,
  MakeLoginWithRefreshTokenCommand,
} from '@app/infra/crqs/auth/commands/make-login-with-refresh-token'
import { RefreshTokenCommand, RefreshTokenCommandResponse } from '@app/infra/crqs/auth/commands/refresh-token.command'
import { ResetUserPasswordCommand } from '@app/infra/crqs/auth/commands/reset-user-passsword.command'
import { SendConfirmEmailCommand } from '@app/infra/crqs/auth/commands/send-confirm-email.command'
import { SendResetPasswordEmailCommand } from '@app/infra/crqs/auth/commands/send-reset-password-emai.command'
import { UpdateNotionDatabaseIdCommand } from '@app/infra/crqs/auth/commands/update-notion-database-id.command'
import { UpdateUserCommand } from '@app/infra/crqs/auth/commands/update-user.command'
import { FetchUserAnalyticsQuery } from '@app/infra/crqs/auth/queries/fetch-user-analytics'
import { ProtectFor } from '@app/infra/crqs/auth/role.guard'
import { GetUserTrialQuote } from '@domain/auth/application/useCases/get-user-trial-quote'
import { FindSubscriberByRecipientId } from '@domain/notifications/application/use-cases/find-subscriber-by-recipient-id'
import { IsPublic, OKAMI_COOKIE_NAME } from '@infra/crqs/auth/auth.guard'
import {
  CreateAccessTokenCommand,
  CreateAccessTokenCommandResponse,
} from '@infra/crqs/auth/commands/create-access-token.command'
import { CreateAdminHashCodeCommand } from '@infra/crqs/auth/commands/create-admin-hash-code.command'
import { InvalidateRefreshTokenCommand } from '@infra/crqs/auth/commands/invalidate-refresh-token-command'
import { LoginCommand } from '@infra/crqs/auth/commands/login.command'
import { ResetPasswordCommand } from '@infra/crqs/auth/commands/reset-password.command'
import { UploadUserImageUrlCommand } from '@infra/crqs/auth/commands/upload-user-image-url.command'
import { ValidateEmailCodeCommand } from '@infra/crqs/auth/commands/validate-email-code.command'
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto'
import { FindUserByIdQuery } from '@infra/crqs/auth/queries/find-user-by-id.query'
import { AccessToken, TokenModel } from '@infra/http/models/token.model'
import { UserHttp, UserModel } from '@infra/http/models/user.model'
import { CreateAdminHashCodeDto } from '@infra/http/validators/create-admin-hash-code.dto'
import { LogoutDto } from '@infra/http/validators/logout.dto'
import { MakeSessionDto } from '@infra/http/validators/make-session.dto'
import { ResetPasswordDto } from '@infra/http/validators/reset-password.dto'
import { ValidateEmailDto } from '@infra/http/validators/validate-email.dto'
import { BadRequestException, Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { RefreshTokenModel, RefreshTokenOnlyModel } from '../models/refresh-token.model'
import { User } from '../user-auth.decorator'
import { CreateUserDto } from '../validators/create-user.dto'
import { RefreshTokenDto } from '../validators/refresh-token.dto'
import { ResetUserPasswordDto } from '../validators/reset-user-password.dto'
import { SendResetPasswordEmailDto } from '../validators/send-reset-password-email.dto'
import { UpdateNotionDatabaseIdDto } from '../validators/update-notiton-database-id.dto'
import { UpdateUserDto } from '../validators/update-user.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly getUserTrialQuote: GetUserTrialQuote,
    private readonly getSubscriberByRecipientId: FindSubscriberByRecipientId,
  ) {}

  @IsPublic()
  @Post('login')
  @ApiOkResponse({ type: TokenModel })
  async makeSession(@Body() data: MakeSessionDto, @Res({ passthrough: true }) res: FastifyReply) {
    const { email, password } = data

    const { token } = await this.commandBus.execute<unknown, { token: string }>(new LoginCommand(email, password))

    return res
      .setCookie(OKAMI_COOKIE_NAME, token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })
      .send()
      .status(201)
  }

  @IsPublic()
  @Post('v2/login')

  @ApiOkResponse({ type: RefreshTokenModel })
  async loginV2(@Body() data: MakeSessionDto, @Res({ passthrough: true }) res: FastifyReply) {
    const results = (await this.commandBus.execute(
      new MakeLoginWithRefreshTokenCommand(data.email, data.password),
    )) as CreateRefreshTokenCommandResponse

    return res
      .setCookie(OKAMI_COOKIE_NAME, results.token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })
      .send({
        refreshToken: results.refreshToken,
        token: results.token,
      })
      .status(200)
  }

  @IsPublic()
  @ApiOkResponse({ type: RefreshTokenOnlyModel })
  @Post('v2/refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto, @Res({ passthrough: true }) res: FastifyReply) {
    const { token } = (await this.commandBus.execute(
      new RefreshTokenCommand(refreshToken),
    )) as RefreshTokenCommandResponse

    return res
      .setCookie(OKAMI_COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
      })
      .status(200)
      .send({
        token,
      })
  }

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
      })
    }

    const file = await req.file()

    const imageData = await file.toBuffer()

    const { id } = req.user as UserTokenDto

    await this.commandBus.execute(
      new UploadUserImageUrlCommand({
        imageFile: imageData,
        imageType: file.filename.split('.').pop(),
        userId: id,
      }),
    )
  }

  @ApiOkResponse({ type: UserHttp })
  @Get('user/me')
  async getMe(@Req() { user }: { user: UserTokenDto }) {
    const results = await this.queryBus.execute(new FindUserByIdQuery(user.id))

    return UserModel.toHttp(results)
  }

  @ProtectFor('ADMIN')
  @Post('/access-token')
  @ApiCreatedResponse({ type: AccessToken })
  async createAccessToken(@Req() { user }: { user: UserTokenDto }) {
    const { accessToken } = await this.commandBus.execute<CreateAccessTokenCommand, CreateAccessTokenCommandResponse>(
      new CreateAccessTokenCommand(user.id),
    )

    return {
      accessToken,
    }
  }

  @IsPublic()
  @Post('/register')
  async register(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply) {
    await this.commandBus.execute(
      new CreateUserCommand({ email: data.email, password: data.password, name: data.name }),
    )

    const sessionCreated = await this.commandBus.execute<unknown, { token: string }>(
      new LoginCommand(data.email, data.password),
    )

    return res
      .setCookie(OKAMI_COOKIE_NAME, sessionCreated.token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })
      .send()
      .status(201)
  }

  @Post('/admin-hash-code')
  async createAdminHashCode(@Req() @Req() { user }: { user: UserTokenDto }, @Body() data: CreateAdminHashCodeDto) {
    await this.commandBus.execute(new CreateAdminHashCodeCommand(user.id, data.hashCodeKey))
  }

  @IsPublic()
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    await this.commandBus.execute(new ResetPasswordCommand(data.email, data.newPassword, data.adminHashCode))
  }

  @Post('logout')
  async logout(@Body() data: LogoutDto, @Res({ passthrough: true }) res: FastifyReply) {
    if (data?.refreshToken) {
      await this.commandBus.execute(new InvalidateRefreshTokenCommand(data.refreshToken))
    }
    return res.clearCookie(OKAMI_COOKIE_NAME).status(201).send()
  }

  @IsPublic()
  @Post('login-mobile')
  async createMobileSession(@Body() data: MakeSessionDto) {
    const { token } = await this.commandBus.execute<unknown, { token: string }>(
      new LoginCommand(data.email, data.password),
    )

    return {
      token,
    }
  }

  @Post('notion/update-database-id')
  async updateNotionDatabaseId(@Body() { notionDatabaseId }: UpdateNotionDatabaseIdDto, @User('id') userId: string) {
    await this.commandBus.execute(new UpdateNotionDatabaseIdCommand(userId, notionDatabaseId))
  }

  @Get('user/analytics')
  async fetchUserAnalytics(@User('id') userId: string) {
    return await this.queryBus.execute(new FetchUserAnalyticsQuery(userId))
  }

  @Get('user/trial-quote')
  async getUserTrialQuoteGet(@User('id') userId: string) {
    const response = await this.getUserTrialQuote.execute({ userId })

    if (response.isLeft()) {
      throw new BadRequestException(response.value)
    }

    return response.value
  }

  @Get('/user/telegram-status')
  async getTelegramStatus(@User('id') userId: string) {
    const results = await this.getSubscriberByRecipientId.execute({ recipientId: userId })

    if (results.isLeft()) {
      throw new BadRequestException(results.value)
    }
    const { telegramChatId } = results.value.subscriber

    return {
      isSubscribed: !!telegramChatId,
      telegramChatId: telegramChatId || null,
    }
  }

  @IsPublic()
  @Post('/password/send-reset-email')
  async sendResetPasswordEmail(@Body() { email }: SendResetPasswordEmailDto) {
    await this.commandBus.execute(new SendResetPasswordEmailCommand(email))
  }

  @IsPublic()
  @Post('/password/reset')
  async resetUserPassword(@Body() { code, newPassword }: ResetUserPasswordDto) {
    await this.commandBus.execute(new ResetUserPasswordCommand(code, newPassword))
  }

  @Put('/user')
  async updateUser(@User('id') userId: string, @Body() data: UpdateUserDto) {
    await this.commandBus.execute(new UpdateUserCommand(userId, data))
  }

  @Post('/user/send-confirm-email')
  async sendConfirmEmail(@User('id') userId: string) {
    await this.commandBus.execute(new SendConfirmEmailCommand(userId))
  }

  @Post('/user/validate-email')
  async validateEmailCode(@Body() { code }: ValidateEmailDto, @User('id') userId: string) {
    await this.commandBus.execute(new ValidateEmailCodeCommand(userId, code))
  }
}
