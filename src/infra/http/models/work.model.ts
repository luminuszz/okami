import { Chapter } from '@domain/work/enterprise/entities/values-objects/chapter';
import { Work } from '@domain/work/enterprise/entities/work';
import { z } from 'zod';

import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { TagModel, tagSchema } from './tag.model';

const workSchema = z
  .object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    url: z.string().url(),
    hasNewChapter: z.boolean(),
    chapter: z.preprocess((value: Chapter) => value.getChapter(), z.number()),
    isFinished: z.boolean(),
    imageId: z.string().optional().nullable(),
    imageUrl: z.string().url().nullable().default(null),
    updatedAt: z.date().optional().nullable(),
    category: z.string().optional().nullable(),
    nextChapterUpdatedAt: z.date().optional().nullable(),
    nextChapter: z.preprocess((value: Chapter) => value.getChapter(), z.number().nullable()),
    isDropped: z.boolean(),
    refreshStatus: z.string().nullable(),
    createdAt: z.date().transform((value) => value.toISOString()),
    userId: z.string().nonempty(),
    tags: z.array(tagSchema).optional(),
    alternativeName: z.string().optional().nullable(),
    isFavorite: z.boolean().optional().default(false),
    description: z.string().optional().nullable(),
  })
  .transform((data) => {
    return {
      ...data,
      imageUrl: data.imageId ? CloudFlareR2StorageAdapter.createS3FileUrl(`${data.id}-${data.imageId}`) : null,
    };
  });

export type WorkHttpType = z.infer<typeof workSchema>;
export type TagHttpType = z.infer<typeof tagSchema>;

export class WorkHttp implements WorkHttpType {
  @ApiProperty()
  chapter: number;
  @ApiProperty()
  hasNewChapter: boolean;
  @ApiProperty()
  id: string;
  @ApiProperty()
  imageId: string;
  @ApiProperty({ nullable: true })
  imageUrl: string | null;
  @ApiProperty()
  isFinished: boolean;
  @ApiProperty()
  name: string;
  @ApiProperty()
  url: string;
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  alternativeName: string;

  @ApiProperty({
    enum: ['ANIME', 'MANGA'],
  })
  category: 'ANIME' | 'MANGA';

  @ApiProperty()
  isDropped: boolean;

  @ApiProperty({ nullable: true, type: Date })
  nextChapterUpdatedAt: Date | null;

  @ApiProperty({ nullable: true, type: Number })
  nextChapter: number | null;

  @ApiProperty()
  refreshStatus: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isFavorite: boolean;

  @ApiProperty({ type: TagModel, isArray: true })
  tags: TagModel[];

  @ApiProperty({ nullable: true })
  description: string;
}

export class WorkModelPaged {
  @ApiProperty({ type: WorkHttp, isArray: true })
  works: WorkHttp[];

  @ApiProperty()
  totalOfPages: number;

  @ApiProperty({ nullable: true })
  nextPage: number;
}

export class WorkModel {
  static toHttpList(works: Work[]): WorkHttpType[] {
    return z.array(workSchema).parse(works);
  }

  static toHttp(work: Work): WorkHttpType {
    return workSchema.parse(work);
  }
}
