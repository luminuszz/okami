import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscribeUserBrowserNotificationDto } from '../validators/subscribe-user-browser-notification.dto';
import { CreateBrowserUserNotificationSubscriptionCommand } from '@app/infra/crqs/notification/commands/create-user-notification-subscription.command';
import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { UserTokenDto } from '@app/infra/crqs/auth/dto/user-token.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/push/subscribe/browser')
  async registerBrowserSubscriber(
    @Body() { auth, endpoint, p256dh }: SubscribeUserBrowserNotificationDto,
    @Req() { user }: { user: UserTokenDto },
  ) {
    await this.commandBus.execute(
      new CreateBrowserUserNotificationSubscriptionCommand({
        credentials: {
          endpoint,
          keys: {
            auth,
            p256dh,
          },
        },
        subscriptionId: user.id,
        userId: user.id,
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/push/browser/public-key')
  async getPublicKey() {
    return {
      publicKey: this.configService.get('WEB_PUSH_PUBLIC_KEY'),
    };
  }
}
