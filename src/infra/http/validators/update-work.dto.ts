import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWorkDto {
  @IsNumber()
  @IsOptional()
  chapter: number;

  @IsUrl()
  @IsOptional()
  url: string;

  @IsOptional()
  @IsString()
  name: string;
}
