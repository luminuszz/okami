import { IsNumber } from 'class-validator';

export class MarkWorkUnreadDto {
  @IsNumber()
  nextChapter: number;
}
