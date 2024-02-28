import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { Category } from '@domain/work/enterprise/entities/work';
import { ApiProperty } from '@nestjs/swagger';

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
}

export const CreateWorkSchema = {
  type: 'object',
  schema: {
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      name: {
        type: 'string',
      },
      chapter: {
        type: 'number',
      },

      url: {
        type: 'string',
      },
      category: {
        type: 'string',
        enum: categoryEnumArray,
      },
    },
  },
};
