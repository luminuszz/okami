import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompareSubscriberAuthTokenDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  authCode: string;
}
