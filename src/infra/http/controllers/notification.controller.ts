import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { User } from '../user-auth.decorator';

import { CompareSubscriberAuthCode } from '@domain/notifications/application/use-cases/compare-subscriber-auth-code';
import { CreateMobilePushSubscription } from '@domain/notifications/application/use-cases/create-mobile-push-subscription';
import { CreateWebPushSubscription } from '@domain/notifications/application/use-cases/create-web-push-subscription';
import { FetchRecentSubscriberNotifications } from '@domain/notifications/application/use-cases/fetch-recent-subscriber-notifications';
import { FindSubscriberByEmail } from '@domain/notifications/application/use-cases/find-subscriber-by-email';
import { MarkNotificationAsRead } from '@domain/notifications/application/use-cases/mark-notification-as-read';
import { SendAuthCodeEmail } from '@domain/notifications/application/use-cases/send-auth-code-mail';
import { UpdateSubscriberTelegramChatId } from '@domain/notifications/application/use-cases/update-subscriber-telegram-chat-id';
import { EnvService } from '@infra/env/env.service';
import { NotificationHttp, NotificationsModel } from '@infra/http/models/notifications.model';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompareSubscriberAuthTokenDto } from '../validators/compare-subscriber-auth-token.dto';
import { GetSubscriberByEmailDto } from '../validators/get-subscriber-by-email.dto';
import { RegisterMobilePushSubscriberDto } from '../validators/register-mobile-push-subscriber.dto';
import { SendAuthCodeByEmailValidator } from '../validators/send-auth-code-by-email';
import { SubscribeUserBrowserNotificationDto } from '../validators/subscribe-user-browser-notification.dto';
import { UpdateTelegramChatIdValidator } from '../validators/update-telegram-chat-id';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly createWebPushSubscription: CreateWebPushSubscription,
    private readonly createSubscriberMobilePush: CreateMobilePushSubscription,
    private readonly fetchRecentSubscriberNotifications: FetchRecentSubscriberNotifications,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsRead,
    private readonly envService: EnvService,
    private readonly updateTelegramChatId: UpdateSubscriberTelegramChatId,
    private readonly sendAuthCodeByEmail: SendAuthCodeEmail,
    private readonly compareSubscriberAuthCode: CompareSubscriberAuthCode,
    private readonly findSubscriberByEmail: FindSubscriberByEmail,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/push/browser/subscribe')
  async registerBrowserSubscriber(
    @Body() { auth, endpoint, p256dh }: SubscribeUserBrowserNotificationDto,
    @User('id') user_id: string,
  ) {
    const results = await this.createWebPushSubscription.execute({
      recipientId: user_id,
      endpoint,
      webPushSubscriptionAuth: auth,
      webPushSubscriptionP256dh: p256dh,
    });

    if (results.isLeft()) {
      throw results.value;
    }
  }

  @UseGuards(AuthGuard)
  @Get('/push/browser/public-key')
  async getPublicKey() {
    return {
      publicKey: this.envService.get('WEB_PUSH_PUBLIC_KEY'),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/push/mobile/subscribe')
  async subscribeInMobile(@Body() { token }: RegisterMobilePushSubscriberDto, @User('id') userId: string) {
    const response = await this.createSubscriberMobilePush.execute({
      recipientId: userId,
      subscriptionToken: token,
    });

    if (response.isLeft()) {
      throw response.value;
    }
  }

  @UseGuards(AuthGuard)
  @Get('recent')
  @ApiOkResponse({ type: NotificationHttp, isArray: true })
  async getRecentNotifications(@User('id') userId: string) {
    const results = await this.fetchRecentSubscriberNotifications.execute({ recipientId: userId });

    if (results.isLeft()) {
      throw results.value;
    }

    const { notifications } = results.value;

    return NotificationsModel.toList(notifications);
  }

  @UseGuards(AuthGuard)
  @Post('mark-read/:notificationId')
  async markNotificationAsRead(@Param('notificationId', ParseObjectIdPipe) notificationId: string) {
    const results = await this.markNotificationAsReadUseCase.execute({ notificationId });

    if (results.isLeft()) {
      throw results.value;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/telegram/update-chat-id')
  async updateChatId(@Body() body: UpdateTelegramChatIdValidator) {
    return this.updateTelegramChatId.execute({
      recipientId: body.recipientId,
      telegramChatId: body.telegramChatId,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/telegram/send-auth-code')
  async sendAuthCode(@Body() body: SendAuthCodeByEmailValidator) {
    return this.sendAuthCodeByEmail.execute({
      email: body.email,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/telegram/compare-auth-code')
  async compareSubscriberAuthCodeCall(@Body() body: CompareSubscriberAuthTokenDto) {
    return this.compareSubscriberAuthCode.execute({
      authCode: body.authCode,
      userId: body.userId,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/telegram/find/:email')
  async getSubscriberByEmail(@Param() { email }: GetSubscriberByEmailDto) {
    return this.findSubscriberByEmail.execute({
      email,
    });
  }
}
