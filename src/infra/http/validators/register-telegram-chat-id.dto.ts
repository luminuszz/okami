import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterTelegramChatIdDto {
  @IsNotEmpty()
  @IsString()
  telegramChatId: string;
}
