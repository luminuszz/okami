import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  chapter: number;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
