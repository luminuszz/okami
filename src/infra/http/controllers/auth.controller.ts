import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '@infra/crqs/auth/commands/login.command';
import { MakeSessionDto } from '@infra/http/validators/make-session.dto';
import { UploadUserImageUrlCommand } from '@infra/crqs/auth/commands/upload-user-image-url.command';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { FindUserByIdQuery } from '@infra/crqs/auth/queries/find-user-by-id.query';
import { UserHttp, UserModel } from '@infra/http/models/user.model';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateAccessTokenCommand,
  CreateAccessTokenCommandResponse,
} from '@infra/crqs/auth/commands/create-access-token.command';
import { AccessToken, TokenModel } from '@infra/http/models/token.model';
import { CurrentUser, WithAuth } from '@infra/crqs/auth/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenModel })
  async makeSession(@Body() data: MakeSessionDto) {
    const { email, password } = data;

    const { token } = await this.commandBus.execute<unknown, { token: string }>(new LoginCommand(email, password));

    return {
      token,
    };
  }

  @WithAuth()
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

  @WithAuth()
  @ApiOkResponse({ type: UserHttp })
  @Get('user/me')
  async getMe(@CurrentUser() user: UserTokenDto) {
    const results = await this.queryBus.execute(new FindUserByIdQuery(user.id));

    return UserModel.toHttp(results);
  }

  @WithAuth()
  @Post('/access-token')
  @ApiCreatedResponse({ type: AccessToken })
  async createAccessToken(@CurrentUser() user: UserTokenDto) {
    const { accessToken } = await this.commandBus.execute<CreateAccessTokenCommand, CreateAccessTokenCommandResponse>(
      new CreateAccessTokenCommand(user.id),
    );

    return {
      accessToken,
    };
  }
}
