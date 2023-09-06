import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MakeSessionDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', format: 'password' })
  password: string;
}
