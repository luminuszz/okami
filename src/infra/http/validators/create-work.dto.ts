import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { Category } from '@domain/work/enterprise/entities/work';
import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from '@infra/utils/IsObjectId';

const categoryEnumArray = ['ANIME', 'MANGA'];

export class CreateWorkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'O valor deve ser um número inteiro' },
  )
  @IsNotEmpty()
  chapter: number;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: categoryEnumArray })
  @IsEnum(categoryEnumArray)
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsNotEmpty()
  @IsObjectId()
  userId: string;
}
