import { IsNumber, IsOptional } from 'class-validator';

export class MarkWorkUnreadDto {
  @IsNumber()
  @IsOptional()
  nextChapter?: number;
}
