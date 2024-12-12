import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetSubscriberByEmailDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
