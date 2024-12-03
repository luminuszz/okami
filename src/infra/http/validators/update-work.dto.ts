import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

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

  @ApiProperty()
  @IsOptional()
  @IsString()
  alternativeName: string;

  @IsOptional()
  @IsArray()
  tagsId: string[];
}
