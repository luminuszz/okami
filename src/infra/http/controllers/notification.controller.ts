import { Body, Controller, Post } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
  @Post('/push/subscribe')
  async registerBrowserSubscriber(@Body() data: any) {}
}
