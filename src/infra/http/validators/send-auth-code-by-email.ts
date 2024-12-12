import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendAuthCodeByEmailValidator {
  @IsEmail()
  @ApiProperty()
  email: string;
}
