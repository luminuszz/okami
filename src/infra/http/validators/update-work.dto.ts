import { IsArray, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
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

  @ApiProperty({
    isArray: true,
    type: String,
  })
  @IsArray({
    message: 'tagsId must be an array of strings',
  })
  tagsId: string[];
}
