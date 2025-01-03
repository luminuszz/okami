import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { WorkStatus } from '@domain/work/enterprise/entities/work';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const calendarSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.date().transform((value) => value.toISOString()),
  updatedAt: z
    .date()
    .transform((value) => value.toISOString())
    .nullable(),

  rows: z.array(
    z.object({
      id: z.string(),
      dayOfWeek: z.number(),
      createdAt: z.date().transform((value) => value.toISOString()),
      Work: z
        .object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
          status: z.string(),
          nextChapter: z.number().nullable(),
          chapters: z.number(),
          imageId: z.string().optional().nullable(),
        })
        .transform((data) => ({
          ...data,
          chapter: data.chapters,
          imageUrl: data.imageId ? CloudFlareR2StorageAdapter.createS3FileUrl(`${data.id}-${data.imageId}`) : null,
        })),
    }),
  ),
});

export type CalendarHttpType = z.infer<typeof calendarSchema>;

export class CalendarRowModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', nullable: true })
  description: string;

  @ApiProperty({
    enum: ['ANIME', 'MANGA'],
  })
  category: 'ANIME' | 'MANGA';

  @ApiProperty({ enum: WorkStatus })
  status: WorkStatus;

  @ApiProperty({ type: 'number', nullable: true })
  nextChapter: number;

  @ApiProperty()
  chapters: number;

  @ApiProperty({ type: 'string', nullable: true })
  imageId: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  imageUrl: string | null;
}

export class CalendarModel implements CalendarHttpType {
  @ApiProperty()
  title: string;

  @ApiProperty({ type: 'string', nullable: true })
  description: string;

  @ApiProperty({ type: 'string', format: 'datetime' })
  createdAt: string;

  @ApiProperty({ type: CalendarRowModel, isArray: true })
  rows: CalendarRowModel[];
}

export class CalendarHttpModelValidator {
  static validate(data: any): CalendarModel {
    const result = calendarSchema.safeParse(data);

    if (!result.success) {
      throw new BadRequestException(result.error.errors.map((error) => `${error.path} ${error.message}`).join(', '));
    }

    return result.data as CalendarModel;
  }
}
