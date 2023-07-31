import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateChapterDto {
  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  chapter: number;
}
