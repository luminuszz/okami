import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendResetPasswordEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
