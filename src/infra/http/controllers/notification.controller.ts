import { AuthGuard } from '@app/infra/crqs/auth/auth.guard';
import { User } from '../user-auth.decorator';

import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterMobilePushSubscriberDto } from '../validators/register-mobile-push-subscriber.dto';
import { SubscribeUserBrowserNotificationDto } from '../validators/subscribe-user-browser-notification.dto';
import { CreateWebPushSubscription } from '@domain/notifications/application/use-cases/create-web-push-subscription';
import { EnvService } from '@infra/env/env.service';
import { CreateMobilePushSubscription } from '@domain/notifications/application/use-cases/create-mobile-push-subscription';
import { FetchRecentSubscriberNotifications } from '@domain/notifications/application/use-cases/fetch-recent-subscriber-notifications';
import { NotificationHttp, NotificationsModel } from '@infra/http/models/notifications.model';
import { MarkNotificationAsRead } from '@domain/notifications/application/use-cases/mark-notification-as-read';
import { ParseObjectIdPipe } from '@infra/utils/parse-objectId.pipe';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly createWebPushSubscription: CreateWebPushSubscription,
    private readonly createSubscriberMobilePush: CreateMobilePushSubscription,
    private readonly fetchRecentSubscriberNotifications: FetchRecentSubscriberNotifications,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsRead,
    private readonly envService: EnvService,
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
}
