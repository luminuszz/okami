import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChapterDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  chapter: number;
}
