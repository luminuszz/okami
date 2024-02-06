import { IsNotEmpty, IsString } from 'class-validator';

export class SubscribeUserBrowserNotificationDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsString()
  @IsNotEmpty()
  auth: string;

  @IsString()
  @IsNotEmpty()
  p256dh: string;
}
