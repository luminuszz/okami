import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class ListTagParams {
  @IsNumber()
  @IsInt()
  @IsOptional()
  page: number;
}
