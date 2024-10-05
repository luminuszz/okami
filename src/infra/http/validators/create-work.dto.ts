import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Category } from '@domain/work/enterprise/entities/work';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

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
  @IsOptional()
  @IsString()
  alternativeName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tagsId?: string;
}

export const CreateWorkApiShape = {
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
      alternativeName: {
        type: 'string',
      },
      tagsId: {
        type: 'string',
      },
    },
  },
};

export const acceptFileTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/blob',
  'application/octet-stream',
];

export const createWorkSchema = z.object({
  category: z.nativeEnum(Category),
  chapter: z.coerce.number().int().min(0),
  name: z.string().min(1),
  url: z.string().url(),
  tagsId: z
    .string()
    .optional()
    .nullable()
    .transform((tagsId) => tagsId?.replaceAll('\n', '')?.split(',')),
  alternativeName: z.string().optional().nullable(),
  file: z
    .object({
      filename: z.string(),
      fileType: z.string().refine((value) => acceptFileTypes.includes(value)),
      buffer: z.instanceof(Buffer),
    })
    .optional(),
});
