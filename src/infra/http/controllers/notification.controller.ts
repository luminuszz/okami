import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { User } from '@app/infra/crqs/user-auth.decorator';
import { MessageService } from '@app/infra/messaging/messaging-service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { RegisterMobilePushSubscriberDto } from '../validators/register-mobile-push-subscriber.dto';
import { RegisterTelegramChatIdDto } from '../validators/register-telegram-chat-id.dto';
import { SubscribeUserBrowserNotificationDto } from '../validators/subscribe-user-browser-notification.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationServiceEmitter: MessageService) {}

  @UseGuards(AuthGuard)
  @Post('/push/browser/subscribe')
  async registerBrowserSubscriber(
    @Body() { auth, endpoint, p256dh }: SubscribeUserBrowserNotificationDto,
    @User('id') user_id: string,
  ) {
    return lastValueFrom(
      this.notificationServiceEmitter.send('create-web-push-subscription', {
        webPushSubscriptionAuth: auth,
        webPushSubscriptionP256dh: p256dh,
        endpoint: endpoint,
        subscriberId: user_id,
      }),
      { defaultValue: '' },
    );
  }

  @UseGuards(AuthGuard)
  @Get('/push/browser/public-key')
  async getPublicKey() {
    return this.notificationServiceEmitter.send('send-web-push-public-key', {});
  }

  @UseGuards(AuthGuard)
  @Post('/push/telegram/subscribe')
  async subscribeInTelegram(@Body() { telegramChatId }: RegisterTelegramChatIdDto, @User('id') userId: string) {
    return lastValueFrom(
      this.notificationServiceEmitter.send('register-telegram-chat', {
        telegramChatId,
        subscriberId: userId,
      }),
      { defaultValue: '' },
    );
  }

  @UseGuards(AuthGuard)
  @Post('/push/mobile/subscribe')
  async subscribeInMobile(@Body() { token }: RegisterMobilePushSubscriberDto, @User('id') userId: string) {
    return lastValueFrom(
      this.notificationServiceEmitter.send('create-mobile-push-subscription', {
        subscriberId: userId,
        subscriptionToken: token,
      }),
      { defaultValue: '' },
    );
  }
}
