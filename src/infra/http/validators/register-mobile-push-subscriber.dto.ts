import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterMobilePushSubscriberDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
