import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { IsObjectId } from '@infra/utils/IsObjectId';

export class UpdateWorkDto {
  @IsObjectId()
  @IsNotEmpty()
  id: string;

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
