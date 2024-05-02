import { IsObjectId } from '@app/infra/utils/IsObjectId';
import { IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsObjectId()
  @IsOptional()
  workId?: string;
}
