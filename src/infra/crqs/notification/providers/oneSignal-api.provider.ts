import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

interface NotificationDto {
  title: string;
  content: string;
  imageUrl?: string;
}

@Injectable()
export class OneSignalApiProvider {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.httpService.axiosRef.defaults.headers['Authorization'] = `Basic ${this.config.get('ONE_SIGNAL_API_TOKEN')}`;
    this.httpService.axiosRef.defaults.baseURL = this.config.get('ONE_SIGNAL_SERVICE_ENDPOINT');
  }

  async sendNotification(notification: NotificationDto) {
    return this.httpService.axiosRef.post('/notifications', {
      app_id: this.config.get('ONE_SIGNAL_APP_ID'),
      included_segments: ['ALL'],
      contents: {
        en: notification.content.toString(),
      },

      big_picture: notification.imageUrl,
    });
  }
}
