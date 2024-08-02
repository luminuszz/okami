import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FilterTagDto {
  @ApiProperty()
  @IsString()
  search: string;
}
