import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListTagParams {
  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty()
  page: number;
}
