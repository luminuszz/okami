import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminHashCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hashCodeKey: string;
}
