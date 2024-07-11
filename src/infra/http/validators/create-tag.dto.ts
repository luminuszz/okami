import { IsObjectId } from '@app/infra/utils/IsObjectId';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsObjectId()
  @IsOptional()
  @ApiProperty({ required: false })
  workId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  color?: string;
}
