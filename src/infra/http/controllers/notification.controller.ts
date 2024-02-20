import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { User } from '@app/infra/crqs/user-auth.decorator';
import { Body, Controller, Get, Inject, OnModuleInit, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscribeUserBrowserNotificationDto } from '../validators/subscribe-user-browser-notification.dto';

@Controller('notification')
export class NotificationController implements OnModuleInit {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationServiceEmitter: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.notificationServiceEmitter.connect();
  }

  @UseGuards(AuthGuard)
  @Post('/push/browser/subscribe')
  async registerBrowserSubscriber(
    @Body() { auth, endpoint, p256dh }: SubscribeUserBrowserNotificationDto,
    @User('id') user_id: string,
  ) {
    return this.notificationServiceEmitter.send('create-web-push-subscription', {
      webPushSubscriptionAuth: auth,
      webPushSubscriptionP256dh: p256dh,
      endpoint: endpoint,
      subscriberId: user_id,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/push/browser/public-key')
  async getPublicKey() {
    return this.notificationServiceEmitter.send('send-web-push-public-key', {});
  }

  @UseGuards(AuthGuard)
  @Post('/push/telegram/subscribe')
  async subscribeInTelegram(@Body() { telegramChatId }: { telegramChatId: string }, @User('id') userId: string) {
    return this.notificationServiceEmitter.send('register-telegram-chat', {
      telegramChatId,
      subscriberId: userId,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/push/mobile/subscribe')
  async subscribeInMobile(@Body() { token }: { token: string }, @User('id') userId: string) {
    return this.notificationServiceEmitter.send('create-mobile-push-subscription', {
      subscriberId: userId,
      subscriptionToken: token,
    });
  }
}
