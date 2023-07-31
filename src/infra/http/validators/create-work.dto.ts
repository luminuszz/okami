import { IsUrl, IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Category } from '@domain/work/enterprise/entities/work';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'O valor deve ser um número inteiro' },
  )
  @IsNotEmpty()
  chapter: number;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsEnum(['ANIME', 'MANGA'])
  @IsNotEmpty()
  category: Category;
}
